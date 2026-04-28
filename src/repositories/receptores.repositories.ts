import { Pool, PoolClient } from "pg";
import { RequestDeleteReceptor, RequestInsertReceptor, RequestReceptor, RequestUpdateLeidoReceptor } from "../dtos/receptores/index.js";


export class ReceptoresRepositories {
    static insertReceptor = async (clientPg: Pool | PoolClient, dto: RequestInsertReceptor) => {
        const { userId, notificationId } = dto;
        const sql = `INSERT INTO receptores(leido, fk_usuario_id, fk_notificacion_id)
                     VALUES($1, $2, $3)
                     RETURNING id as receptor_id`;
        const values = [false, userId, notificationId];
        const result = await clientPg.query(sql, values);
        return result;
    };

    static findNotificacionByIdReceptor = async (clientPg: Pool | PoolClient, dto: RequestReceptor) => {
        const { userId, lastNotificationDate } = dto;
        const sql = `SELECT 
                        rec.leido,
                        noti.titulo,
                        noti.descripcion,
                        noti.tipo,
                        noti.fk_post_id AS post_id,
                        rec.id AS receptor_id,
                        to_char(noti.fk_post_created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS post_created_at,
                        to_char(noti.created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS notification_created_at
                     FROM receptores rec
                     JOIN notificacion noti
                     ON rec.fk_notificacion_id = noti.id
                     WHERE rec.fk_usuario_id = $1
                     ${ lastNotificationDate ? " AND noti.created_at < $2 " : "" }
                     ORDER BY noti.created_at DESC
                     LIMIT 20`;
        const values = [userId, lastNotificationDate];
        if( !lastNotificationDate ) values.pop();
        const result = await clientPg.query(sql, values);
        return result;
    };

    static deleteReceptor = async (clientPg: Pool | PoolClient, dto: RequestDeleteReceptor) => {
        const { userId, receptorId } = dto;
        const sql = `DELETE FROM receptores WHERE id=$1 AND fk_usuario_id=$2
                     RETURNING id as receptor_id`;
        const values = [receptorId, userId];
        const result = await clientPg.query(sql, values);
        return result;
    };

    static updateReceptorLeido =  async (clientPg: Pool | PoolClient, dto: RequestUpdateLeidoReceptor) => {
        const { userId, receptorId } = dto;
        const sql = `UPDATE receptores SET leido=true WHERE id=$1 AND fk_usuario_id=$2
                     RETURNING id as receptor_id`;
        const values = [receptorId, userId];
        const result = await clientPg.query(sql, values);
        return result;
    };
};