import { OAuth2Client, TokenPayload } from "google-auth-library";
import dotenv from "dotenv";
import { QueryResult } from "pg";
import jwt from "jsonwebtoken";
import { UsuarioRepositories } from "../../repositories/usuario.repositorio.js";
import { getPoolDB } from "../../db/index.js";
import { AppError } from "../../errors/AppError.js";
import { ProveedorEspRespositories } from "../../repositories/proveedorEsp.repositories.js";
import { ResponseAuthUserSchema } from "../../dtos/autenticacion/authUser.dto.js";
import { UserSessionsRepositories } from "../../repositories/userSessions.repositories.js";
import { RequestAuth } from "../../dtos/autenticacion/createNewUserSession.dto.js";
dotenv.config();

const authCient = new OAuth2Client(process.env.GOOGLE_CLIENT_APP_ID, process.env.GOOGLE_OAUTH_SECRET);

export class AuthGoogleService {
    static loginGoogle = () => {
        const url = authCient.generateAuthUrl({
            access_type: "offline",
            scope: ["profile", "email"],
            redirect_uri: process.env.GOOGLE_CALLBACK_URL
        });
        return url;
    };

    static authenticateOrCreateUser = async (dto: RequestAuth) => {
        const { code, deviceInfo } = dto;
        console.log("El dto",dto);
        // Obtener el token para despues verificarlo
        const { tokens } = await authCient.getToken({
            code,
            redirect_uri: process.env.GOOGLE_CALLBACK_URL
        });
        console.log({ mensaje: "obtiene el token", tokens });

        // Verificar que el token si sea de la misma app
        const ticket = await authCient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_APP_ID
        });
        console.log({ mensaje: "token valido" });

        const payload = ticket.getPayload();

        const pool = getPoolDB();
        const clientPg = await pool.connect();
        try{
            await clientPg.query("BEGIN");
            let usuario: QueryResult<any>;
            usuario = await UsuarioRepositories.findUserByEmail(clientPg, payload);

            // Crear usuario si no existe
            if( !usuario.rowCount ){
                
                const dto = { 
                    nameService: "google",   
                    espId: payload.sub
                };
                
                const proveedorEsp = await ProveedorEspRespositories.insertRowProveedorEsp(clientPg, dto);
                usuario = await UsuarioRepositories.insertNewUser(clientPg, { ...payload, proveedorEspId: proveedorEsp.rows[0].id });
            };

            const { success, data, error } = ResponseAuthUserSchema.safeParse(usuario.rows[0]);
            if( !success ){
                throw new AppError(`Error al parsear los resultados del usuario - ${error}`, 500 );
            };

            const payloadTokenUser = {
                userId: data.id,
                alias: data.alias,
                ...{ usuarioOrganizacionId: data.usuario_organizacion_id ? data.usuario_organizacion_id : null },
                ...{ rol: data.rol }
            };
            const payloadRefreshToken = { userId: data.id };
            const token = jwt.sign(payloadTokenUser, process.env.JWT_SECRET, { expiresIn: "10m" });
            const refreshToken = jwt.sign(payloadRefreshToken, process.env.JWT_SECRET, { expiresIn: "1 year" });

            await UserSessionsRepositories.insertNewSession(clientPg, {
                refreshToken,
                deviceInfo,
                userId: data.id
            });

            await clientPg.query("COMMIT");
            return {
                userData: {
                    email: data.email,
                    nombre: data.nombre,
                    apellido: data.apellido,
                    alias: data.alias,
                    rol: data.rol,
                    url_img: data.url_img,
                    createdAt: data.created_at,
                    esp: data.esp
                },
                tokens: {
                    token,
                    refreshToken
                }
            };
        }
        catch(error){
            if( clientPg ) await clientPg.query("ROLLBACK");
            throw new AppError(`Error al crear el usuario - ${error.message}`, 500);
        }
        finally{
            if( clientPg ) clientPg.release();
        };
    };
};