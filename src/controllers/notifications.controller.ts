import { Request, Response, NextFunction } from "express";
import { RequestCreatePushToken } from "../dtos/notificaciones/index.js";
import { NotificacionService } from "../services/notificaciones/notificacion.service.js";

export class NotificationsController {
    static createToken = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.validateRequestData as RequestCreatePushToken;
            console.log(req.validateRequestData);
            const serverResponse = await NotificacionService.createTokenNotification(dto);
            res.status(201).json({
                success: true,
                message: "Notification Token creado",
                errors: [],
                data: serverResponse
            });
        }   
        catch(error){
            next(error);
        };
    };
};