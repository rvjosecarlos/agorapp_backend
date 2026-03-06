import { getPoolDB } from "../db/index.js";
import { RequestCreateLike, RequestDeleteLike, ResponseCreateLikeSchema, ResponseDeleteLikeSchema } from "../dtos/likes/index.dto.js";
import { AppError } from "../errors/AppError.js";
import { LikeRepositories } from "../repositories/likes.repositories.js";

export class LikeService {
    static createLike = async (dto: RequestCreateLike) => {
        const clientPg = getPoolDB();
        const result = await LikeRepositories.insertLike(clientPg, dto);
        const { success, data, error } = ResponseCreateLikeSchema.safeParse(result.rows[0]);
        if( !success ){
            throw new AppError(`Error al parsear los datos de like ${error.message}`, 500);
        };
        return data;
    };

    static removeLike = async (dto: RequestDeleteLike) => {
        const clientPg = getPoolDB();
        const result = await LikeRepositories.deleteLike(clientPg, dto);
        const { success, data, error } = ResponseDeleteLikeSchema.safeParse(result.rows[0]);
        if( !success ){
            throw new AppError(`Error al parsear los datos de like ${error.message}`, 500);
        };
        return data;
    };
};