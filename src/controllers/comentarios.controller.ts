import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { ComentarioService } from "../services/comentario.service.js";

export class Comentario {
    static create =  async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = {}
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
};