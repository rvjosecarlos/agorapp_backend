import { Pool, PoolClient } from "pg";
import { RequestCreateComentario } from "../dtos/comentario/createComentario.dto.js";
import { RequestComentarios } from "../dtos/comentario/getComments.dto.js";
import { RequestReplyComments } from "../dtos/comentario/getReplyComments.dto.js";
import { RequestUpdateComment, RequestUpdateParentComment } from "../dtos/comentario/updateComentario.dto.js";
import { RequestDeleteComment } from "../dtos/comentario/deleteComentario.dto.js";

export class ComentarioRepositories {
    static insertComment = async (clientPg: Pool | PoolClient, dto: RequestCreateComentario) => {
        const { postId, createdAt, comentario, userId, replyCommentId } = dto;
        const sql = `INSERT INTO comentario(comentario, fk_usuario_id, fk_post_id, fk_post_created_at, fk_response_coment_id)
                     VALUES($1, $2, $3, $4, $5)
                     RETURNING id, to_char(created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_at, comentario, fk_usuario_id, fk_response_coment_id`;
        
        const values = [comentario, userId, postId, createdAt, replyCommentId];
        const result = await clientPg.query(sql, values);

        return result;
    };

    static findComments = async (clientPg: Pool, dto: RequestComentarios) => {
        const { lastId, postId, createdAt } = dto;
        const sql = `SELECT 
                        c.id, 
                        c.comentario, 
                        c.answered,
                        to_char(c.created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_at, 
                        u.alias, 
                        u.url_img 
                     FROM comentario c
                     JOIN usuario u
                     ON c.fk_usuario_id = u.id
                     WHERE c.fk_post_id = $1 AND c.fk_post_created_at = $2 ${ lastId ? " AND c.id > $3" : "" } AND c.fk_response_coment_id IS NULL
                     ORDER BY c.created_at
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

    static updateComment = async (clientPg: Pool | PoolClient, dto: RequestUpdateComment) => {
        const { postId, createdAt, comentario, userId, commentId } = dto;
        const sql = `UPDATE comentario 
                     SET comentario=$1
                     WHERE id=$2 AND fk_post_id=$3 AND fk_post_created_at=$4 AND fk_usuario_id=$5
                     RETURNING 
                        id, 
                        comentario, 
                        fk_post_id, 
                        to_char(fk_post_created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS fk_post_created_at,
                        to_char(updated_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS comment_update_at`;
        const values = [comentario, commentId, postId, createdAt, userId];
        const result = await clientPg.query(sql, values);
        return result.rows[0];
    };

    static updateParentComment = async (clientPg: Pool | PoolClient, dto: RequestUpdateParentComment) => {
        const { replyCommentId } = dto;
        const sql = `UPDATE comentario 
                     SET answered=TRUE
                     WHERE id=$1
                     RETURNING id`;
        const values = [replyCommentId];
        const result = await clientPg.query(sql, values);
        return result.rows[0];
    };

    static deleteComment =  async ( clientPg: Pool | PoolClient, dto: RequestDeleteComment ) => {
        const { commentId, postId, createdAt, userId } = dto;
        const sql = `DELETE FROM comentario 
                     WHERE 
                        id=$1 AND
                        fk_post_id=$2 AND
                        fk_post_created_at=$3 AND
                        fk_usuario_id=$4`;
        const values = [commentId, postId, createdAt, userId];
        const result = await clientPg.query(sql, values);
        return result;
    };
};