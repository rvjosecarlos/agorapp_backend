import { Request, Response, NextFunction } from "express";
import { ComentarioService } from "../services/comentario.service.js";
import { RequestCreateComentario } from "../dtos/comentario/createComentario.dto.js";
import { RequestComentarios } from "../dtos/comentario/getComments.dto.js";
import { RequestReplyComments } from "../dtos/comentario/getReplyComments.dto.js";

export class ComentarioController {
    static create =  async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.validateRequestData as RequestCreateComentario;
            const serviceResponse = await ComentarioService.crearComentario(dto);
            res.status(201).json({
                success: true,
                message: "Comentario creado",
                errors: [],
                data: serviceResponse
            });
        }
        catch(error){
            next(error);
        };
    };

    static getComments = async ( req: Request, res: Response, next: NextFunction ) => {
        try{
            const dto = req.validateRequestData as RequestComentarios;
            const serverResponse = await ComentarioService.getCommentsList(dto);
            res.status(200).json({
                success: true,
                message: "Comentarios obtenidos",
                errors: [],
                data: serverResponse
            });
        }
        catch(error){
            next(error);
        };
    };

    static getReplyComments = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.validateRequestData as RequestReplyComments;
            const serverResponse = await ComentarioService.getReplyCommentsList(dto);
            res.status(200).json({
                success: true,
                message: "Comentarios obtenidos",
                errors: [],
                data: serverResponse
            });
        }
        catch(error){
            next(error);
        };
    };
};