import { getPoolDB } from "../db/index.js";
import { RequestCreateComentario, ResponseCreateComentarioSchema } from "../dtos/comentario/createComentario.dto.js";
import { RequestDeleteComment } from "../dtos/comentario/deleteComentario.dto.js";
import { RequestComentarios, ResponseComentriosSchema } from "../dtos/comentario/getComments.dto.js";
import { RequestReplyComments, ResponseReplyCommentSchema } from "../dtos/comentario/getReplyComments.dto.js";
import { RequestUpdateComment, ResponseUpdateComment } from "../dtos/comentario/updateComentario.dto.js";
import { AppError } from "../errors/AppError.js";
import { ComentarioRepositories } from "../respositories/comentario.repositorie.js";

export class ComentarioService {
    static crearComentario = async (dto: RequestCreateComentario) => {
        const poolClient = getPoolDB();
        const comentario = await ComentarioRepositories.insertComment(poolClient, dto);
        const comentarioInsertado = {
            comentId: comentario.id,
            comentario: comentario.comentario,
            fecha: comentario.created_at
        }
        
        const { success, data, error } = ResponseCreateComentarioSchema.safeParse(comentarioInsertado);
        if( !success ){
            throw new AppError(`Error al obtener los resultados: - ${error}`, 500);
        };
        
        return data;
    };

    static getCommentsList = async (dto: RequestComentarios) => {
        const clientPg = getPoolDB();
        const comentarios = await ComentarioRepositories.findComments(clientPg, dto);
        const { success, data, error } = ResponseComentriosSchema.safeParse(comentarios);
        if( !success ){
            throw new AppError(`Error al obtener los resultados: - ${error}`, 500);
        };
        return data;
    };

    static getReplyCommentsList = async (dto: RequestReplyComments) => {
        const clientPg = getPoolDB();
        const replyComents = await ComentarioRepositories.findReplyComments(clientPg, dto);
        const { success, data, error } = ResponseReplyCommentSchema.safeParse(replyComents);
        if( !success ){
            throw new AppError(`Error al obtener los resultados: - ${error}`, 500);
        };
        return data;
    };

    static modifyComment = async (dto: RequestUpdateComment) => {
        const clientPg = getPoolDB();
        const updateComment = await ComentarioRepositories.updateComment(clientPg, dto);
        const { success, data, error } = ResponseUpdateComment.safeParse(updateComment);
        if( !success ){
            throw new AppError(`Error al obtener los resultados: - ${error}`, 500);
        };
        return data;
    };

    static removeComment = async (dto: RequestDeleteComment) => {
        const clientPg = getPoolDB();
        const result = await ComentarioRepositories.deleteComment(clientPg, dto);
        if( !result.rows.length ){
            throw new AppError("No se encontró el recurso solicitado", 404);
        };
    };
};