import { getPoolDB } from "../db/index.js";
import { RequestCreateComentario, ResponseCreateComentarioSchema } from "../dtos/comentario/createComentario.dto.js";
import { RequestDeleteComment } from "../dtos/comentario/deleteComentario.dto.js";
import { RequestComentarios, ResponseComentriosSchema } from "../dtos/comentario/getComments.dto.js";
import { RequestReplyComments, ResponseReplyCommentSchema } from "../dtos/comentario/getReplyComments.dto.js";
import { RequestUpdateComment, ResponseUpdateComment } from "../dtos/comentario/updateComentario.dto.js";
import { AppError } from "../errors/AppError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ComentarioRepositories } from "../repositories/comentario.repositorie.js";
import { NotificacionTokenRepositories } from "../repositories/notification.tokens.repositories.js";
import { PostRepositories } from "../repositories/post.repositories.js";
import { NotificacionService } from "./firebase/notificacion.firebase.service.js";

export class ComentarioService {
    static crearComentario = async (dto: RequestCreateComentario) => {
        const poolDB = getPoolDB();
        const clientPg = await poolDB.connect();
        try{
            await clientPg.query("BEGIN");
            if( dto.replyCommentId ) ComentarioRepositories.updateParentComment(clientPg, { replyCommentId: dto.replyCommentId });
            const resultComentarioPromise = ComentarioRepositories.insertComment(clientPg, dto);
            const resultTotalComentarioPromise = PostRepositories.addTotalCommentPost(clientPg, dto);
            const [resultComentario, resultTotalComentarioPost] = await Promise.all([resultComentarioPromise, resultTotalComentarioPromise]);
            if( !resultTotalComentarioPost.rowCount ) throw new NotFoundError("No se encontró el recurso - Post");
            const comentario = resultComentario.rows[0];
            const comentarioInsertado = {
                comentId: comentario.id,
                comentario: comentario.comentario,
                fecha: comentario.created_at
            };
            const { success, data, error } = ResponseCreateComentarioSchema.safeParse(comentarioInsertado);
            if( !success ){
                throw new AppError(`Error al parsear los datos de comentario: - ${error}`, 500);
            };
            await clientPg.query("COMMIT");

            // Proceso de notificaciones
            const tokensResult = await NotificacionTokenRepositories.findTokens(clientPg, { usersId: [dto.postOwnerId] });
            if( tokensResult.rowCount ){
                const tokens = tokensResult.rows;
                await NotificacionService.sendPushNotification(tokens, {
                    title: "Tu publicación tiene un nuevo comentario",
                    body: `${dto.alias} comento tu publicación`,
                    url: `${process.env.DEV_FRONT_NGROK_YO}/post/reporte/${dto.postId}?createdAt=${dto.createdAt}`
                });
            }
            return data;
        }
        catch(error){
            if(clientPg) await clientPg.query("ROLLBACK");
            if( error instanceof NotFoundError ) throw new NotFoundError(error.message);
            throw new AppError(`Error al crear un comentario - ${error.message}`, 500);
        }
        finally{
            if(clientPg) clientPg.release();
        }
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
        const poolDB = getPoolDB();
        const clientPg = await poolDB.connect();
        try{
            const resultComentarioPromise = ComentarioRepositories.deleteComment(clientPg, dto);
            const resultRemoveTotalComentariosPromise = PostRepositories.removeTotalCommentPost(clientPg, dto);
            const [resultComentario, resultRemoveTotalComentario] = await Promise.all([resultComentarioPromise, resultRemoveTotalComentariosPromise]);
            if( !resultComentario.rowCount || !resultRemoveTotalComentario.rowCount ){
                const error = `Comentario: ${resultComentario.rowCount} - Total comentarios: ${resultRemoveTotalComentario.rowCount}`;
                throw new NotFoundError(`No se encontró el recurso solicitado - ${error}`);
            };
        }
        catch(error){
            if(clientPg) await clientPg.query("ROLLBACK");
            if( error instanceof NotFoundError ) throw new NotFoundError(error.message);
            throw new AppError(`Error al eliminar el comentario - ${error.message}`, 500);
        }
        finally{
            if(clientPg) clientPg.release();
        }
    };
};