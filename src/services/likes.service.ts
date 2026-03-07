import { getPoolDB } from "../db/index.js";
import { RequestCreateLike, RequestDeleteLike, ResponseCreateLikeSchema, ResponseDeleteLikeSchema } from "../dtos/likes/index.dto.js";
import { AppError } from "../errors/AppError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { LikeRepositories } from "../repositories/likes.repositories.js";
import { PostRepositories } from "../repositories/post.repositories.js";

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
            if( !success ){
                throw new AppError(`Error al parsear los datos de like ${error.message}`, 500);
            };
            await clientPg.query("COMMIT");
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