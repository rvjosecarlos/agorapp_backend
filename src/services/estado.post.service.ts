import { body } from "express-validator";
import { getPoolDB } from "../db/index.js";
import { RequestEstadosPost } from "../dtos/estadosPost/createEstadoPost.dto.js";
import { EstadoPostRepositories } from "../repositories/estado.post.repositories.js";
import { NotificacionTokenRepositories } from "../repositories/notification.tokens.repositories.js";
import { NotificacionService } from "./firebase/notificacion.firebase.service.js";
import { LikeRepositories } from "../repositories/likes.repositories.js";
import { ResponseFindLikesByPostIdSchema } from "../dtos/likes/index.dto.js";
import { AppError } from "../errors/AppError.js";

export class EstadoPostService {
    static createEstadoPost = async (dto: RequestEstadosPost) => {
        const pool = getPoolDB();
        const dtoFindUserLike = {
            postCreatedAt: dto.postCreatedAt,
            postId: dto.postId,
        };

        const estadoPostResult = await EstadoPostRepositories.insertEstadoPost(pool, dto);
        const resultUserLike = await LikeRepositories.findLikesByPostId(pool, dtoFindUserLike);

        const { 
            success: successUserLike, 
            data: dataUserLike, 
            error: errorUserLike 
        } = ResponseFindLikesByPostIdSchema.safeParse(resultUserLike.rows);
        if( !successUserLike ) throw new AppError(`Error al parsear resultados de UserLike - ${errorUserLike.message}`, 500);
        
        const usersId = dataUserLike.map(userLike => userLike.user_id_liked);
        const tokensResult = await NotificacionTokenRepositories.findTokens(pool, { usersId });
        if( tokensResult.rowCount ){
            const { estado, postId, createdAt } = estadoPostResult;
            const tokens = tokensResult.rows;
            await NotificacionService.sendPushNotification(tokens, {
                title: "Tu publicación tiene un nuevo estado",
                body: `${dto.alias} coloco el estado ${estado}`,
                url: `${process.env.DEV_FRONT_NGROK_YO}/post/reporte/${postId}?createdAt=${createdAt}`
            });
        }
        return estadoPostResult;
    }
}