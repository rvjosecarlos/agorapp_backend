import { Pool, PoolClient } from "pg";
import { Usuario } from "../types/index.js";
import { RequestCreatePushToken, RequestFindTokens } from "../dtos/notificaciones/index.js";


export class NotificacionTokenRepositories {
    static insertTokenNotification = async (clientPg: Pool | PoolClient, dto: RequestCreatePushToken) => {
        const { pushToken, userId, platform } = dto;
        const sql = `INSERT INTO user_token_notification(token, fk_usuario_id, platform)
                     VALUES($1, $2, $3)
                     RETURNING id as push_token_id, token as push_token`;
        const values = [pushToken, userId, platform];
        const result = await clientPg.query(sql, values);
        return result;
    };

    static findTokens = async (clientPg: Pool | PoolClient, dto: RequestFindTokens) => {
        const { userId } = dto;
        const sql = `SELECT 
                        token, 
                        to_char(last_used_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS last_used_at
                     FROM user_token_notification 
                     WHERE fk_usuario_id=$1`;
        const values = [userId];
        const result = await clientPg.query(sql, values);
        return result;
    };
    
    static deleteTokens = async (clientPg: Pool | PoolClient, dto: string[]) => {
        const sql = `DELETE FROM user_token_notification WHERE token = ANY($1::string[])`;
        const values = [dto];
        const result = await clientPg.query(sql, values);
        return result;
    };
};