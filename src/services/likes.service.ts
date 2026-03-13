import { getPoolDB } from "../db/index.js";
import { RequestCreateLike, RequestDeleteLike, ResponseCreateLikeSchema, ResponseDeleteLikeSchema } from "../dtos/likes/index.dto.js";
import { ResponseFindTokens, ResponseInsertNotification } from "../dtos/notificaciones/index.js";
import { AppError } from "../errors/AppError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { LikeRepositories } from "../repositories/likes.repositories.js";
import { NotificationRepositories } from "../repositories/notification.respositories.js";
import { NotificacionTokenRepositories } from "../repositories/notification.tokens.repositories.js";
import { PostRepositories } from "../repositories/post.repositories.js";
import { NotificacionService } from "./notificaciones/notificacion.service.js";

export class LikeService {
    static createLike = async (dto: RequestCreateLike) => {
        const poolDB = getPoolDB();
        const clientPg = await poolDB.connect();
        try{
            await clientPg.query("BEGIN");
            const resultLikePromise = LikeRepositories.insertLike(clientPg, dto);
            const resultPostPromise = PostRepositories.updateLikePost(clientPg, dto);
            const [resultLike, resultPost] = await Promise.all([resultLikePromise, resultPostPromise]);

            if( !resultPost.rowCount ) throw new NotFoundError("Recurso no encontrado - Post");

            const res = { ...resultLike.rows[0], ...resultPost.rows[0] };
            const { success, data, error } = ResponseCreateLikeSchema.safeParse(res);
            if( !success ) throw new AppError(`Error al parsear los datos de like ${error.message}`, 500);

            await clientPg.query("COMMIT");

            const tituloNotificacion = "Alguien apoyó tu publicación";
            const { post_id, created_at } = data;

            // Insertar la notificacion
            const result = await NotificationRepositories.insertNotification(clientPg, {
                titulo: tituloNotificacion,
                descripcion: `Tu post: ${data.titulo}`,
                tipo: "like",
                postId: post_id,
                createdAt: created_at
            });
            const { 
                success: successInsertNotification, 
                data: dataInsertNotification, 
                error: errorInsertNotification 
            } = ResponseInsertNotification.safeParse(result.rows[0]);
            if( !successInsertNotification ) console.error(`Error al parsear el resultado de insertnotificacion - ${errorInsertNotification.message}`);// Error 

            // Notificar al propietario del post usando firebase
            const resultTokensNotification = await NotificacionTokenRepositories.findTokens(clientPg, { userId: data.owner_id });
            const { success: successFindToken, data: dataFindToken, error: errorFindToken } = ResponseFindTokens.safeParse(resultTokensNotification.rows);
            if( !successFindToken ){
                console.log(`Error al parsear el notificationToken - ${errorFindToken.message}`);
                //throw new AppError(`Error al parsear el notificationToken - ${errorFindToken.message}`, 500);
            };

            const tokens = dataFindToken.map( res => res.token );
            await NotificacionService.sendPushNotification(tokens, {
                title: tituloNotificacion,
                body: `${ dto.alias } apoya tu publicación ${ resultPost.rows[0].titulo }`,
                data: { postId: post_id, createdAt: created_at }
            });
            
            return data;
        }
        catch(error){
            if(clientPg) await clientPg.query("ROLLBACK");
            if( error instanceof NotFoundError ) throw new NotFoundError(error.message);
            throw new AppError(`Error al likear el post ${error.message}`, 500);
        }
        finally{
            if(clientPg) clientPg.release()
        };
    };

    static removeLike = async (dto: RequestDeleteLike) => {
        const poolDB = getPoolDB();
        const clientPg = await poolDB.connect();
        try{
            await clientPg.query("BEGIN");
            const resultLikePromise = LikeRepositories.deleteLike(clientPg, dto);
            const resultPostPromise = PostRepositories.updateDeleteLikePost(clientPg, dto);
            const [ resultLike, resultPost ] = await Promise.all([resultLikePromise, resultPostPromise]);

            if( !resultLike.rowCount ) throw new NotFoundError("Recurso no encontrado - Like");

            const res = { ...resultLike.rows[0], ...resultPost.rows[0] };
            const { success, data, error } = ResponseDeleteLikeSchema.safeParse(res);
            if( !success ){
                throw new AppError(`Error al parsear los datos de like ${error.message}`, 500);
            };
            await clientPg.query("COMMIT");
            return data;
        }
        catch(error){
            if(clientPg) await clientPg.query("ROLLBACK");
            if( error instanceof NotFoundError ) throw new NotFoundError(error.message);
            throw new AppError(`Error al deslikear el post ${error.message}`, 500);
        }
        finally{
            if(clientPg) clientPg.release(); 
        };
    };
};