import { Pool, PoolClient } from "pg";
import { Usuario } from "../types/index.js";
import { RequestFindTokens } from "../dtos/notificaciones/index.js";


export class NotificacionTokenRepositories {
    static insertTokenNotification = async (clientPg: Pool | PoolClient, dto) => {
        const {  } = dto;
        const sql = ``;
        const values = [];
        const result = await clientPg.query(sql, values);
        return result;
    };

    static findTokens = async (clientPg: Pool | PoolClient, dto: RequestFindTokens) => {
        const { userId } = dto;
        const sql = `SELECT token, last_used_at FROM user_token_notification WHERE fk_usuario_id=$1`;
        const values = [userId];
        const result = await clientPg.query(sql, values);
        return result;
    };
};