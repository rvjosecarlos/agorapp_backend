import { Pool } from "pg";
import { RequestCreateComentario } from "../dtos/comentario/createComentario.dto.js";
import { RequestComentarios } from "../dtos/comentario/getComments.dto.js";
import { RequestReplyComments } from "../dtos/comentario/getReplyComments.dto.js";

export class ComentarioRepositories {
    static insertComment = async (clientPg: Pool, dto: RequestCreateComentario) => {
        const { postId, createdAt, comentario, usuarioId, replyCommentId } = dto;
        const sql = `INSERT INTO comentario(comentario, fk_usuario_id, fk_post_id, fk_post_created_at, fk_response_coment_id)
                     VALUES($1, $2, $3, $4, $5)
                     RETURNING id, to_char(created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_at, comentario, fk_usuario_id, fk_response_coment_id`;
        
        const values = [comentario, usuarioId, postId, createdAt, replyCommentId];
        const result = await clientPg.query(sql, values);

        return result.rows[0];
    };

    static findComments = async (clientPg: Pool, dto: RequestComentarios) => {
        const { lastId, postId, createdAt } = dto;
        const sql = `SELECT 
                        c.id, 
                        c.comentario, 
                        to_char(c.created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_at, 
                        u.alias, 
                        u.url_img 
                     FROM comentario c
                     JOIN usuario u
                     ON c.fk_usuario_id = u.id
                     WHERE c.fk_post_id = $1 AND c.fk_post_created_at = $2 ${ lastId ? " AND c.id > $3" : "" }
                     LIMIT 20`;
        const values= [postId, createdAt];
        if(lastId) values.push(lastId);

        const result = await clientPg.query(sql, values);
        return result.rows;
    };

    static findReplyComments = async (clientPg: Pool, dto: RequestReplyComments) => {
        const { lastId, postId, createdAt, replyCommentId } = dto;
        const sql = `SELECT
                        c.id,
                        c.comentario,
                        to_char(c.created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_at,
                        u.alias,
                        u.url_img
                     FROM
                     comentario c
                     JOIN usuario u
                     ON c.fk_usuario_id = u.id
                     WHERE c.fk_post_id=$1 AND c.fk_post_created_at=$2 AND c.fk_response_coment_id=$3 ${ lastId ? "AND c.id > $4" : "" }
                     LIMIT 20`;
        const values = [postId, createdAt, replyCommentId];
        if( lastId ) values.push(lastId);
        const result = await clientPg.query(sql, values);
        return result.rows;
    };
};