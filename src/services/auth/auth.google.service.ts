import { OAuth2Client, TokenPayload } from "google-auth-library";
import dotenv from "dotenv";
import { UsuarioRepositories } from "../../repositories/usuario.repositorio.js";
import { getPoolDB } from "../../db/index.js";
import { AppError } from "../../errors/AppError.js";
import { ProveedorEspRespositories } from "../../repositories/proveedorEsp.repositories.js";
import QueryString from "qs";
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

    static authenticateOrCreateUser = async (googleCode: string) => {
        // Obtener el token para despues verificarlo
        const { tokens } = await authCient.getToken({
            code: googleCode,
            redirect_uri: process.env.GOOGLE_CALLBACK_URL
        });

        // Verificar que el token si sea de la misma app
        const ticket = await authCient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_APP_ID
        });

        const payload = ticket.getPayload();
        console.log("AUTENTICACION VALIDA EN GOOGLE");

        const pool = getPoolDB();
        const clientPg = await pool.connect();
        try{
            
            const usuario = await UsuarioRepositories.findUserByEmail(clientPg, payload);
            console.log({usuario});
            if( usuario.rowCount ){
                console.log("USUARIO ENCONTRADO");
                return usuario.rows[0];
            };

            await clientPg.query("BEGIN");
            const dto = { 
                nameService: "google",   
                esp_id: payload.sub
            };
            const proveedorEsp = await ProveedorEspRespositories.insertRowProveedorEsp(clientPg, dto);
            console.log("SE CREA EL PROVEEDOR", proveedorEsp.rows[0]);
            const newUser = await UsuarioRepositories.insertNewUser(clientPg, { ...payload, proveedorEspId: proveedorEsp.rows[0].id });
            console.log("SE CREA EL USURIO");
            await clientPg.query("COMMIT");
            return newUser.rows[0];
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