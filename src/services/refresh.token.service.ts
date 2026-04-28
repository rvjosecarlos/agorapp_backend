import jwt from "jsonwebtoken";
import { UsuarioServices } from "./usuario.service.js";
import { PayloadTokenUserSchema, UsuarioSession } from "../types/index.js";
import { AppError } from "../errors/AppError.js";
import { getPoolDB } from "../db/index.js";
import { UserSessionsRepositories } from "../repositories/userSessions.repositories.js";

export class RefreshTokenService {
    static refreshToken = async (dto: Pick<UsuarioSession, "deviceInfo" | "refreshToken">) => {
        const { refreshToken } = dto;
        const clientPg = getPoolDB();
        
        const validToken = jwt.verify(refreshToken, process.env.JWT_SECRET) as { userId: number };

        if( !validToken.userId ) throw new AppError("Token de seguridad no válido", 401);
        const { success, data, error } = PayloadTokenUserSchema.pick({ userId: true }).safeParse(validToken);
        if( !success ) throw new AppError(`Error al parsear los datos - ${error}`, 500);

        const result = await UserSessionsRepositories.findSession(clientPg, { ...dto, userId:validToken.userId });
        const token = result.rows[0];
        if( !token ){
            throw new AppError("Token no válido", 401);
        };
        
        const user = await UsuarioServices.getUserById(data.userId);
        const newTokenData = {
            userId: user.id,
            organizacionId: user.organizacionId || 0,
            rol: user.rol,
            alias: user.alias
        };

        const newToken = jwt.sign(newTokenData, process.env.JWT_SECRET, { expiresIn: "10m" });
        return newToken;
    };

    static deleteRefreshToken = async (dto: UsuarioSession["refreshToken"]) => {
        const clientPg = getPoolDB();
        const result = await UserSessionsRepositories.deleteSession(clientPg, dto);
        if( !result.rowCount ){
            throw new AppError("No se encontró el recurso solicitado", 404);
        };
    };
};