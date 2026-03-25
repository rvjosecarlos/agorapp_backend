import { Request, Response, NextFunction } from "express";
import { RequestCreateLike, RequestDeleteLike } from "../dtos/likes/index.dto.js";
import { LikeService } from "../services/likes.service.js";

export class LikeController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.validateRequestData as RequestCreateLike;
            const serverReponse = await LikeService.createLike({...dto});
            res.status(201).json({
                success: true,
                message: "Likeado",
                errors: [],
                data: serverReponse
            });
        }
        catch(error){
            next(error);
        };
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.validateRequestData as RequestDeleteLike;
            const serverReponse = await LikeService.removeLike(dto);
            res.status(200).json({
                success: true,
                message: "Like eliminado",
                errors: [],
                data: serverReponse
            });
        }
        catch(error){
            next(error);
        };
    };
};