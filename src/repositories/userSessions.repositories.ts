import { Pool, PoolClient } from "pg";
import { UsuarioSession } from "../types/index.js";

export class UserSessionsRepositories {
    static insertNewSession = async (clientPg: PoolClient | Pool, dto: UsuarioSession) => {
        const { refreshToken, deviceInfo, userId } = dto;
        const sql = `INSERT INTO user_sessions(refresh_token, device_info, fk_user_id)
                     VALUES($1, $2, $3)`;
        const values = [refreshToken, deviceInfo, userId];
        const result =  await clientPg.query(sql, values);
        return result;
    };

    static findSession = async (clientPg: PoolClient | Pool, dto: UsuarioSession) => {
        const { userId, refreshToken, deviceInfo } = dto;
        const sql = `SELECT refresh_token as token
                     FROM user_sessions 
                     WHERE refresh_token = $1 AND fk_user_id = $2 AND device_info = $3`;
        const values = [refreshToken, userId, deviceInfo];
        const result = await clientPg.query(sql, values);
        return result;
    };

    static deleteSession = async (clientPg: PoolClient | Pool, dto: UsuarioSession["refreshToken"]) => {
        const refreshToken = dto;
        const sql = "DELETE FROM user_sessions WHERE refresh_token = $1";
        const values = [refreshToken];
        const result = await clientPg.query(sql, values);
        console.log({ result });
        return result;
    };
};