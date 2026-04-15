import { Request, Response, NextFunction } from "express";
import { RequestCreatePushToken } from "../dtos/notificaciones/index.js";
import { NotificacionService } from "../services/firebase/notificacion.firebase.service.js";
import { Notifications } from "../services/notifications.service.js";
import { RequestReceptor } from "../dtos/receptores/index.js";

export class NotificationsController {
    static createToken = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.validateRequestData as RequestCreatePushToken;
            const serverResponse = await NotificacionService.createTokenNotification(dto);
            console.log("Crea el token de notificacion");
            res.status(201).json({
                success: true,
                message: "Notification Token creado",
                errors: [],
                data: serverResponse
            });
        }   
        catch(error){
            console.log("El error al crear el token", error.message);
            next(error);
        };
    };

    static getNotifications = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.validateRequestData as RequestReceptor;
            dto.userId = 11;
            const serverResponse = await Notifications.getNotificationsByUser(dto);
            res.status(200).json({
                success: true,
                message: "Notificaciones obtenidas",
                errors: [],
                data: serverResponse
            });
        }
        catch(error){
            next(error)
        };
    };
};