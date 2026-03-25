import { Request, Response, NextFunction } from "express";
import { ReceptoresService } from "../services/receptores.service.js";
import { RequestDeleteReceptor, RequestUpdateLeidoReceptor } from "../dtos/receptores/index.js";

export class ReceptoresController {
    static updateLeido = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.validateRequestData as RequestUpdateLeidoReceptor;
            const serverResponse = await ReceptoresService.updateLeido(dto);
            res.status(200).json({
                success: true,
                message: "Notificacion de receptor actualizada",
                errors: [],
                data: serverResponse
            });
        }
        catch(error){
            next(error);
        };
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.validateRequestData as RequestDeleteReceptor;
            const serverResponse = await ReceptoresService.deleteNotificacionReceptor(dto);
            res.status(200).json({
                success: true,
                message: "Notificación eliminada",
                errors: [],
                data: serverResponse
            });
        }
        catch(error){
            next(error);
        };
    };
};