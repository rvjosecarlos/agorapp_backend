import { getMessaging, FidMulticastMessage  } from "firebase-admin/messaging";
import { appFirebase } from "../../config/firebase.js";
import { getPoolDB } from "../../db/index.js";
import { RequestCreatePushToken, RequestSendNotification, ResponseInsertTokenNotification } from "../../dtos/notificaciones/index.js";
import { AppError } from "../../errors/AppError.js";
import { NotificacionTokenRepositories } from "../../repositories/notification.tokens.repositories.js";

export class NotificacionService {
    static sendPushNotification = async (tokens: string[], payload: RequestSendNotification) => {
        if(!tokens || tokens.length === 0) return;

        const notificacion = {
            data: {
                title: payload.title,
                body: payload.body,
                url: payload.url
            },
            tokens
        };

        try{
            const clientPg = getPoolDB();
            const resFirebase = await getMessaging(appFirebase).sendEachForMulticast(notificacion);
            // Elimina los tokens expirados o no validos
            if( resFirebase.failureCount ){
                const invalidTokens: string[] = [];
                resFirebase.responses.forEach(async (response, indice) => {
                    if( !response.success ) invalidTokens.push(tokens[indice]);
                });
                await NotificacionTokenRepositories.deleteTokens(clientPg, invalidTokens);
            };
            console.log({resFirebase});
            return;
        }
        catch(error){
            console.error(`Error al enviar la notificacion - ${error}`);
        };
    };

    static createTokenNotification = async (dto: RequestCreatePushToken) => {
        const clientPg = getPoolDB();
        const result = await NotificacionTokenRepositories.insertTokenNotification(clientPg, dto);
        const { success, data, error } = ResponseInsertTokenNotification.safeParse(result.rows[0]);
        if( !success ){
            throw new AppError(`Error al parsear los datos del push token ${error.message}`, 500);
        };
        return data;
    };
};