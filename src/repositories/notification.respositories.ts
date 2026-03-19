import { Pool, PoolClient } from "pg";
import { RequestInsertNotification } from "../dtos/notificaciones/index.js";

export class NotificationRepositories {
    static insertNotification = async (clientPg: Pool | PoolClient, dto: RequestInsertNotification) => {
        const { titulo, descripcion, tipo, postId, createdAt } = dto;
        const sql = `INSERT INTO notificacion(titulo, descripcion, tipo, fk_post_id, fk_post_created_at)
                     VALUES($1, $2, $3, $4, $5)
                     RETURNING id, titulo, descripcion, tipo`;
        const values = [titulo, descripcion, tipo, postId, createdAt];
        const result = await clientPg.query(sql, values);
        return result;
    };

    static findNotificationsByUser = async (clientPg: Pool | PoolClient, dto) => {
        const { userId } = dto;
        const sql = `SELECT
                        titulo,
                        descripcion,
                        tipo,
                        fk_post_id as post_id,
                        fk_post_created_at as post_created_at
                     FROM
                        notificacion
                     WHERE fk_usuario_id = $1`;
        const values = [userId];
        const result = await clientPg.query(sql, values);
        return result;
    };

    static deleteNotification = async (clientPg: Pool | PoolClient, dto: RequestInsertNotification) => {
        const {  } = dto;
        const sql = ``;
        const values = [];
        const result = await clientPg.query(sql, values);
        return result;
    };
};