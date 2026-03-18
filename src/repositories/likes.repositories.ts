import { Pool, PoolClient } from "pg";
import { RequestCreateLike, RequestDeleteLike } from "../dtos/likes/index.dto.js";

export class LikeRepositories {
    static insertLike = async (clientPg: Pool | PoolClient, dto: RequestCreateLike ) => {
        const { postId, postCreatedAt, userId } = dto;
        const sql = `INSERT INTO post_like 
                     ( fk_post_id, fk_post_created_at, fk_usuario_id )
                     VALUES ( $1, $2, $3 )
                     RETURNING id AS like_id`;
        const values = [postId, postCreatedAt, userId];
        const result = await clientPg.query(sql, values);
        return result;
    };

    static deleteLike = async (clientPg: Pool | PoolClient, dto: RequestDeleteLike) => {
        const { postId, postCreatedAt, userId } = dto;
        const sql = `DELETE FROM post_like WHERE fk_post_id = $1 AND fk_post_created_at = $2 AND fk_usuario_id = $3
                     RETURNING id as like_id`;
        const values = [postId, postCreatedAt, userId];
        const result = await clientPg.query(sql, values);
        return result;
    };
};