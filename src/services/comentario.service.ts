import { getPoolDB } from "../db/index.js";
import { RequestCreateComentario, ResponseCreateComentarioSchema } from "../dtos/comentario/createComentario.dto.js";
import { RequestDeleteComment } from "../dtos/comentario/deleteComentario.dto.js";
import { RequestComentarios, ResponseComentriosSchema } from "../dtos/comentario/getComments.dto.js";
import { RequestReplyComments, ResponseReplyCommentSchema } from "../dtos/comentario/getReplyComments.dto.js";
import { RequestUpdateComment, ResponseUpdateComment } from "../dtos/comentario/updateComentario.dto.js";
import { ResponseInsertNotification } from "../dtos/notificaciones/index.js";
import { ResponseInsertReceptorSchema } from "../dtos/receptores/index.js";
import { AppError } from "../errors/AppError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ComentarioRepositories } from "../repositories/comentario.repositorie.js";
import { NotificationRepositories } from "../repositories/notification.respositories.js";
import { NotificacionTokenRepositories } from "../repositories/notification.tokens.repositories.js";
import { PostRepositories } from "../repositories/post.repositories.js";
import { ReceptoresRepositories } from "../repositories/receptores.repositories.js";
import { NotificacionService } from "./firebase/notificacion.firebase.service.js";

export class ComentarioService {
    static crearComentario = async (dto: RequestCreateComentario) => {
        const poolDB = getPoolDB();
        const clientPg = await poolDB.connect();
        try{
            await clientPg.query("BEGIN");
            let resultParentComment = { id: 0, owner_comment_id: 0, comentario: "" };
            if( dto.replyCommentId ) resultParentComment = await ComentarioRepositories.updateParentComment(clientPg, { replyCommentId: dto.replyCommentId });
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

            // Insertar la notificacion
            const result = await NotificationRepositories.insertNotification(clientPg, {
                titulo: "Tu publicación tiene un nuevo comentario",
                descripcion: `${dto.alias}: ${dto.comentario.slice(0,100)}...`,
                tipo: "comentario",
                postId: dto.postId,
                createdAt: dto.createdAt
            });
            console.log({ result: result.rows[0] });
            const { 
                success: successInsertNotification, 
                data: dataInsertNotification, 
                error: errorInsertNotification 
            } = ResponseInsertNotification.safeParse(result.rows[0]);
            if( !successInsertNotification ) console.error(`Error al parsear el resultado de insertnotificacion - ${errorInsertNotification.message}`); 

            // Proceso de notificaciones
            const tokensResult = await NotificacionTokenRepositories.findTokens(clientPg, { 
                usersId: dto.replyCommentId ? [resultParentComment.owner_comment_id] : [dto.postOwnerId] 
            });
        
            if( tokensResult.rowCount ){
                const tokens = tokensResult.rows.map( res => res.token );
                await NotificacionService.sendPushNotification(tokens, {
                    title: dto.replyCommentId ? `${dto.alias} ha respondido a tu comentario:` : "Tu publicación tiene un nuevo comentario",
                    body: dto.replyCommentId ? dto.comentario.slice(0,40) : `${dto.alias} ha respondido a tu publicación`,
                    url: `${process.env.PROD_FRONT}/post/reporte/${dto.postId}?createdAt=${dto.createdAt}`
                });
            }

            // Crear entrada en receptores
            const resultReceptores = await ReceptoresRepositories.insertReceptor(clientPg, {
                userId: dto.postOwnerId,
                notificationId: dataInsertNotification.id
            });
            const { 
                success: successInsertReceptor, 
                data: dataInsertReceptor, 
                error: errorInsertReceptor 
            } = ResponseInsertReceptorSchema.safeParse(resultReceptores.rows[0]);
            if( !successInsertReceptor ){
                console.log(`Error al parsear el receptor result - ${errorInsertReceptor.message}`);
            };
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
            await clientPg.query("BEGIN");
            const resultComentario = await ComentarioRepositories.deleteComment(clientPg, dto);
            //const resultRemoveTotalComentariosPromise = PostRepositories.removeTotalCommentPost(clientPg, dto);
            //const [resultComentario, resultRemoveTotalComentario] = await Promise.all([resultComentarioPromise, resultRemoveTotalComentariosPromise]);
            if( !resultComentario.rowCount /*|| !resultRemoveTotalComentario.rowCount*/ ){
                const error = `Comentario: ${resultComentario.rowCount} - Total comentarios: ${/*resultRemoveTotalComentario.rowCount*/ ""}`;
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