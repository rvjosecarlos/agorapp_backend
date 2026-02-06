import { Request, Response, NextFunction } from "express";
import { RequestEstadosPost } from "../dtos/estadosPost/createEstadoPost.dto.js";
import { EstadoPostService } from "../services/estado.post.service.js";

export class EstadosPostController {
    static create = async ( req: Request, res: Response, next: NextFunction ) => {
        try{
            const dto = req.validateRequestData as RequestEstadosPost;
            const serviceResponse = await EstadoPostService.createEstadoPost(dto);
            res.status(201).json({
                success: true,
                message: "Estado creado",
                error: [],
                data: serviceResponse
            });
        }
        catch(error){
            next(error);
        };
    };
};