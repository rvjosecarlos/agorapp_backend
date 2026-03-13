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
};