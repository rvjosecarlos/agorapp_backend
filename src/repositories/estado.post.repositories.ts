import { Pool, PoolClient } from "pg";
import { RequestEstadosPost } from "../dtos/estadosPost/createEstadoPost.dto.js";

export class EstadoPostRepositories {
    static insertEstadoPost = async (clientPg: PoolClient | Pool, dto: RequestEstadosPost) => {
        const { estado, descripcion, usuarioOrganizacionId, postId, postCreatedAt } = dto;
        const sql = `INSERT INTO post_historial_estado
                        (estado, descripcion, fk_usuario_organizacion_id, fk_post_id, fk_post_created_at)
                    VALUES
                        ($1, $2, $3, $4, $5)
                    RETURNING id, estado, descripcion, fk_post_id, fk_post_created_at, fk_usuario_organizacion_id, editado, created_at, updated_at`;
        const values = [estado, descripcion, usuarioOrganizacionId, postId, postCreatedAt];
        const result = await clientPg.query(sql, values);
        return {
            id: result.rows[0].id,
            estado: result.rows[0].estado,
            descripcion: result.rows[0].descripcion,
            postId: result.rows[0].fk_post_id,
            postCreatedAt: result.rows[0].fk_post_created_at,
            usuarioOrganizacionId: result.rows[0].fk_usuario_organizacion_id,
            editado: result.rows[0].editado,
            createdAt: result.rows[0].created_at,
            updatedAt: result.rows[0].updated_at
        };
    };
};