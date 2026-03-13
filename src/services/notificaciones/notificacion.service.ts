import { firebaseAdmin } from "../../config/firebase.js";
import { RequestSendNotification } from "../../dtos/notificaciones/index.js";

export class NotificacionService {
    static sendPushNotification = async (tokens: string[], payload: RequestSendNotification) => {
        if(!tokens || tokens.length === 0) return;

        const notificacion = {
            notification: { 
                title: payload.title,
                body: payload.body
            },
            data: payload.data,
            tokens
        };

        try{
            const resFirebase = await firebaseAdmin.messaging().sendEachForMulticast(notificacion);
            console.log("Exito en notificar", resFirebase);
            if( resFirebase.failureCount ){
                console.log("Mal no notifco", resFirebase);
            };
        }
        catch(error){
            console.error(`Error al enviar la notificacion -${error}`);
        };
    };
};