import { Pool, PoolClient } from "pg";
import { getPoolDB } from "../db/index.js";
import { CreatePostAvisoDTO, CreatePostPublicidadDTO, CreatePostReporteDTO } from "../dtos/post/createpost.dto.js";
import { QueryPostListGlobalDTO, QueryUniquePostGlobalSchemaDTO, RequestMapPostList, RequestUserPostList } from "../dtos/post/readpost.dto.js";
import { UpdatePostDTO } from "../dtos/post/uploadpost.dto.js";
import { DeletePostDTO } from "../dtos/post/detelPost.dto.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { RequestCreateLike, RequestDeleteLike } from "../dtos/likes/index.dto.js";
import { RequestCreateComentario } from "../dtos/comentario/createComentario.dto.js";
import { RequestDeleteComment } from "../dtos/comentario/deleteComentario.dto.js";

const globalQueryListPost = `SELECT
                p.id,
                p.tipo,
                p.titulo,
                p.descripcion,
                p.total_comentarios,
                p.total_likes,
                p.total_compartidos,
                p.link,
                to_char(p.created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_At,
                to_char(p.updated_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS updated_At,
                p.fk_categoria_id,
                usuario.alias,
                usuario.url_img,
                usuario.id AS usuario_id,
                p.estilos,
                ST_X(u.geom:: geometry) as lon,
                ST_Y(u.geom:: geometry) as lat,
                u.id as ubicacion_id,
                u.direccion as direccion,
                org.nombre,
                COALESCE(liked.u_like, null) AS liked,
                COALESCE(img.imagenes, '[]') AS imagenes
            FROM post p
            JOIN usuario
                ON usuario.id = p.fk_usuario_id
            LEFT JOIN ubicacion u
                ON p.fk_ubicacion_id = u.id
            LEFT JOIN organizacion org
                ON p.fk_organizacion_id = org.id
            LEFT JOIN LATERAL(
                SELECT fk_usuario_id as u_like
                FROM post_like l
                WHERE l.fk_post_id = p.id AND l.fk_post_created_at = p.created_at AND l.fk_usuario_id = $1
            ) liked ON true
            LEFT JOIN LATERAL(
                SELECT
                    json_agg(
                        json_build_object(
                            'imgId', pi.id,
                            'urlImg', pi.url_img
                        )
                    ) AS imagenes
                FROM post_imagenes pi
                WHERE pi.fk_post_id = p.id AND pi.fk_post_created_at = p.created_at 
            ) img ON true
            WHERE p.activo=TRUE`;

export class PostRepositories {
    static insertReportPost = async (clientPg: PoolClient, post: CreatePostReporteDTO, ubicacionId: number) => {
        
        const sql = `INSERT INTO post ( 
                     tipo, 
                     titulo, 
                     fk_categoria_id, 
                     descripcion, 
                     fk_ubicacion_id, 
                     fk_usuario_id 
                     ${ post.estilos ? ", estilos" : ""} 
                     )
                     VALUES ($1, $2, $3, $4, $5, $6 ${ post.estilos ? ",$7" : "" })
                     RETURNING id, to_char(created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_at`;
        const values = [ post.tipo, post.titulo, post.categoriaId, post.descripcion, ubicacionId, post.userId ];
        if(post.estilos) values.push(post.estilos); 
            
        const result = await clientPg.query(sql, values);
        return { id: parseInt(result.rows[0].id), createdAt: result.rows[0].created_at };
        
    };

    static insertAvisoPublicacionPost =  async (clientPg: PoolClient, post: CreatePostAvisoDTO | CreatePostPublicidadDTO, ubicacionId?: number) => {
        
        const { estilos, link } = post;
        const values = Object.values(post);
        const tmpValues = values.map( (value, indice) => `$${indice + 1}`).join();

        const sql = `INSERT INTO post (
                     titulo,
                     descripcion,
                     fk_usuario_id,
                     tipo,
                     fk_organizacion_id
                     ${ estilos ? ",estilos" : "" }
                     ${ link ? ",link" : "" }
                     ${ ubicacionId ? ",fk_ubicacion_id" : "" }   
                    )
                    VALUES (${tmpValues}) 
                    RETURNING id, to_char(created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_at`;
            
        const result = await clientPg.query(sql, values);
        return { id: parseInt(result.rows[0].id), createdAt: result.rows[0].created_at };
        
    };

    static findPostList = async (dto: QueryPostListGlobalDTO) => {
        const pool = getPoolDB();
        const { lat, lon, distancia, lastId, lastPostDate, userId } = dto;
        const sql = `${globalQueryListPost}
            ${ lastId ? " AND (p.created_at < $6 OR (p.created_at = $6 AND p.id < $5))" : ""}
            AND ST_DWithin( u.geom, ST_MakePoint($2, $3)::geography, $4) 
            ORDER BY p.created_at DESC
            LIMIT 20`;
        
        const result = lastId ? 
                            await pool.query(sql, [11, lon, lat, distancia, lastId, lastPostDate]) : 
                            await pool.query(sql, [11, lon, lat, distancia]);
        return result.rows;
    };

    static findMapPostList = async (clientPg: Pool | PoolClient, dto: RequestMapPostList) => {
        const { neLat, neLng, swLat, swLng } = dto;
        const sql = `
            SELECT
                p.id,
                to_char(p.created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_at,
                p.titulo,
                p.descripcion,
                p.tipo,
                p.fk_categoria_id as categoria,
                u.direccion,
                ST_X(u.geom:: geometry) as lng,
                ST_Y(u.geom:: geometry) as lat
            FROM
            post p
            LEFT JOIN ubicacion u
                ON p.fk_ubicacion_id = u.id
            WHERE
                p.activo = TRUE
            AND
                ST_Within( u.geom:: geometry, ST_MakeEnvelope($1, $2, $3, $4, 4326) ) 
        `;
        const values = [neLng, neLat, swLng, swLat];
        const result = await clientPg.query(sql, values);
        return result;
    };

    static findUserPostList = async (clientPg: Pool | PoolClient, dto: RequestUserPostList) => {
        console.log(dto);
        const { userId, lastPostDate } = dto;
        const sql = `${globalQueryListPost} 
                    AND fk_usuario_id=$1 
                    ${ lastPostDate ? " AND (p.created_at < $2) " : " " } 
                    ORDER BY p.created_at DESC
                    LIMIT 20`;
        const result =  lastPostDate ? await clientPg.query(sql, [userId, lastPostDate]) :
                                       await clientPg.query(sql, [userId]);
        return result;
    };

    static findPost = async (dto: QueryUniquePostGlobalSchemaDTO) => {
        const pool = getPoolDB();
        const { id, createdAt, userId } = dto;
        const sql = `
            SELECT
                p.id,
                p.tipo,
                p.titulo,
                p.descripcion,
                p.total_comentarios,
                p.total_likes,
                p.total_compartidos,
                p.link,
                to_char(p.created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_at,
                to_char(p.updated_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS updated_at,
                p.fk_categoria_id,
                usuario.alias,
                usuario.url_img,
                usuario.id as usuario_id,
                p.estilos,
                ST_X(u.geom:: geometry) as lon,
                ST_Y(u.geom:: geometry) as lat,
                u.id as ubicacion_id,
                u.direccion as direccion,
                org.nombre,
                COALESCE(linked.u_like, null) AS liked,
                COALESCE(img.imagenes, '[]') AS imagenes,
                COALESCE(asignado.asignado, '[]') AS asignado,
                COALESCE(estados_post.estados, '[]') AS estados
            FROM post p
            JOIN usuario
                ON p.fk_usuario_id = usuario.id
            LEFT JOIN ubicacion u
                ON p.fk_ubicacion_id = u.id
            LEFT JOIN organizacion org
                ON p.fk_organizacion_id = org.id
            LEFT JOIN LATERAL(
                SELECT fk_usuario_id IS NOT NULL as u_like
                FROM post_like l
                WHERE l.fk_post_id = p.id AND l.fk_post_created_at = p.created_at AND l.fk_usuario_id = $3
            ) linked on true
            LEFT JOIN LATERAL(
                SELECT json_agg(
                    json_build_object(
                        'imgId', pi.id,
                        'urlImg', pi.url_img
                    )
                ) AS imagenes
                FROM post_imagenes pi
                WHERE pi.fk_post_id = p.id AND pi.fk_post_created_at = p.created_at
            ) img ON true
            LEFT JOIN LATERAL(
                SELECT json_agg(
                    json_build_object(
                        'usuarioAsignado', asignacion.fk_usuario_asignado_organizacion_id
                    )
                ) AS asignado
                FROM asignacion_reportes asignacion
                WHERE asignacion.fk_post_id=p.id AND asignacion.fk_post_created_at=$2
            ) asignado ON true
            LEFT JOIN LATERAL(
                SELECT json_agg(
                    json_build_object(
                        'estadoId', es.id,
                        'estado', es.estado,
                        'descripcion', es.descripcion,
                        'createdAt', es.created_at,
                        'updatedAt', es.updated_at,
                        'alias', json_build_object(
                            'usuarioOrganizacionId', es.fk_usuario_organizacion_id, 
                            'alias', usuario_global.alias
                            ),
                        'editado', es.editado
                    )
                ) AS estados
                FROM post_historial_estado es
                LEFT JOIN usuario_organizacion uo
                    ON es.fk_usuario_organizacion_id = uo.id AND es.activo = TRUE
                LEFT JOIN LATERAL(
                    SELECT usuario.alias
                    FROM usuario
                    WHERE usuario.id = uo.fk_usuario_id AND usuario.activo = TRUE
                ) usuario_global ON true
                WHERE es.fk_post_id = p.id AND es.fk_post_created_at = p.created_at AND es.activo = TRUE
            ) estados_post ON true
            WHERE p.created_at=$2 AND p.id=$1 AND p.activo=TRUE`;
        const values = [id, createdAt, userId];
        const result = await pool.query(sql, values)
        if( result.rows.length === 0 ) throw new NotFoundError("No se encontro el recurso solicitado");
        return result.rows;
    
    };

    static findMinimalDataPost = async (dto: QueryUniquePostGlobalSchemaDTO) => {
        const pool = getPoolDB();
        const { id, createdAt } = dto;
        const sql = `SELECT id, created_at, tipo, usuario_id 
                     FROM post 
                     WHERE id=$1 AND created_at=$2`;
        const values = [id, createdAt];
        const result = await pool.query(sql, values);
        if( result.rows.length === 0 ) throw new NotFoundError("No se encontro el recurso solicitado");
        return result.rows;
    };

    static updatePost = async (clientPg: PoolClient, dataPostUpdate: UpdatePostDTO ) => {
        
        const { createdAt, descripcion, id, categoriaId, estilos, link, userId } = dataPostUpdate;
        const dataOptional = {
            ...( categoriaId && { "fk_categoria_id": categoriaId }),
            ...( estilos && { estilos }),
            ...( link && { link })
        };
        const tmpOptional = Object.entries(dataOptional).map( (column, indice) => `${column[0]}=$${indice+5}`);
        const sql = `UPDATE post SET descripcion=$3, ${ tmpOptional.toString() }
                     WHERE id=$1 AND created_at=$2 AND activo=TRUE AND fk_usuario_id=$4
                     RETURNING id, to_char(updated_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS updated_at`;
        const values = [id, createdAt, descripcion, userId, ...Object.values(dataOptional)];

        const result = await clientPg.query(sql, values);
        return result.rows;
        return { id: parseInt(result.rows[0].id), uploadedAt: result.rows[0].updated_at };
        
    };

    static deactivatePost = async (clientPg: PoolClient, dataPostDelete: DeletePostDTO) => {
        const { id, createdAt, userId } = dataPostDelete;
        const sql = `UPDATE post SET activo=FALSE 
                     WHERE id=$1 AND created_at=$2 AND activo=TRUE AND fk_usuario_id=$3
                     RETURNING id, to_char(updated_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS updated_at`;
        const values = [id, createdAt, userId];
        const result = await clientPg.query(sql, values);
        return { id: parseInt(result.rows[0].id), uploadedAt: result.rows[0].updated_at };
    };

    static updateLikePost = async (clientPg: Pool | PoolClient, dto: RequestCreateLike) => {
        const { postId, postCreatedAt } = dto;
        const sql = `UPDATE post SET total_likes = total_likes + 1
                     WHERE id=$1 AND created_at=$2 AND activo=TRUE
                     RETURNING 
                        id AS post_id,
                        fk_usuario_id AS owner_id, 
                        titulo, 
                        tipo,
                        to_char(updated_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS updated_at,
                        to_char(created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_at`;
        const values = [postId, postCreatedAt];
        const result = await clientPg.query(sql, values);
        return result;
    };

    static updateDeleteLikePost = async (clientPg: Pool | PoolClient, dto: RequestDeleteLike) => {
        const { postId, postCreatedAt } = dto;
        const sql = `UPDATE post SET total_likes = total_likes - 1
                     WHERE id=$1 AND created_at=$2 AND activo=TRUE
                     RETURNING id AS post_id, to_char(updated_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS updated_at`;
        const values = [postId, postCreatedAt];
        const result = await clientPg.query(sql, values);
        return result;
    };

    static addTotalCommentPost = async (clientPg: Pool | PoolClient, dto: RequestCreateComentario) => {
        const { postId, createdAt } = dto;
        const sql = `UPDATE post SET total_comentarios = total_comentarios + 1
                     WHERE id=$1 AND created_at=$2 AND activo=TRUE
                     RETURNING id AS post_id, to_char(updated_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS updated_at`;
        const values = [postId, createdAt];
        const result = await clientPg.query(sql, values);
        return result;
    };

    static removeTotalCommentPost = async (clientPg: Pool | PoolClient, dto: RequestDeleteComment) => {
        const { postId, createdAt } = dto;
        const sql = `UPDATE post SET total_comentarios = total_comentarios - 1
                     WHERE id=$1 AND created_at=$2 AND activo=TRUE
                     RETURNING id AS post_id, to_char(updated_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS updated_at`;
        const values = [postId, createdAt];
        const result = await clientPg.query(sql, values);
        return result;
    };
};

/*const findPost = `
            SELECT
                p.id,
                p.tipo,
                p.titulo,
                p.descripcion,
                p.total_comentarios,
                p.total_likes,
                p.total_compartidos,
                p.link,
                to_char(p.created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_at,
                to_char(p.updated_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS updated_at,
                p.fk_categoria_id,
                usuario.alias,
                usuario.url_img,
                usuario.id as usuario_id,
                p.estilos,
                ST_X(u.geom:: geometry) as lon,
                ST_Y(u.geom:: geometry) as lat,
                u.id as ubicacion_id,
                org.nombre,
                COALESCE(linked.u_like, null) AS liked,
                COALESCE(img.imagenes, '[]') AS imagenes,
                COALESCE(c.comentarios, '[]') AS comentarios,
                COALESCE(estados_post.estados, '[]') AS estados
            FROM post p
            JOIN usuario
                ON p.fk_usuario_id = usuario.id
            LEFT JOIN ubicacion u
                ON p.fk_ubicacion_id = u.id
            LEFT JOIN organizacion org
                ON p.fk_organizacion_id = org.id
            LEFT JOIN LATERAL(
                SELECT fk_usuario_id IS NOT NULL as u_like
                FROM post_like l
                WHERE l.fk_post_id = p.id AND l.fk_post_created_at = p.created_at AND l.fk_usuario_id = $3
            ) linked on true
            LEFT JOIN LATERAL(
                SELECT json_agg(
                    json_build_object(
                        'imgId', pi.id,
                        'urlImg', pi.url_img
                    )
                ) AS imagenes
                FROM post_imagenes pi
                WHERE pi.fk_post_id = p.id AND pi.fk_post_created_at = p.created_at
            ) img ON true
            LEFT JOIN LATERAL(
                SELECT json_agg(
                    json_build_object(
                        'comentId', coments.id,
                        'comentario', coments.comentario,
                        'fecha', coments.created_at,
                        'replyCommentId', coments.fk_response_coment_id,
                        'usuario', cu.alias
                    )
                ) AS comentarios
                FROM comentario coments
                JOIN usuario cu
                    ON coments.fk_usuario_id = cu.id
                WHERE coments.fk_post_id = p.id AND coments.fk_post_created_at = p.created_at    
            ) c ON true
            LEFT JOIN LATERAL(
                SELECT json_agg(
                    json_build_object(
                        'estadoId', es.id,
                        'estado', es.estado,
                        'descripcion', es.descripcion,
                        'createdAt', es.created_at,
                        'updatedAt', es.updated_at,
                        'alias', json_build_object(
                            'usuarioOrganizacionId', es.fk_usuario_organizacion_id, 
                            'alias', usuario_global.alias
                            ),
                        'editado', es.editado
                    )
                ) AS estados
                FROM post_historial_estado es
                LEFT JOIN usuario_organizacion uo
                    ON es.fk_usuario_organizacion_id = uo.id AND es.activo = TRUE
                LEFT JOIN LATERAL(
                    SELECT usuario.alias
                    FROM usuario
                    WHERE usuario.id = uo.fk_usuario_id AND usuario.activo = TRUE
                ) usuario_global ON true
                WHERE es.fk_post_id = p.id AND es.fk_post_created_at = p.created_at AND es.activo = TRUE
            ) estados_post ON true
            WHERE p.created_at=$2 AND p.id=$1 AND p.activo=TRUE`; */