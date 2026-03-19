import { getPoolDB } from "../db/index.js";
import { RequestReceptor, RequestUpdateLeidoReceptor, ResponseReceptorSchema } from "../dtos/receptores/index.js";
import { AppError } from "../errors/AppError.js";
import { ReceptoresRepositories } from "../repositories/receptores.repositories.js";

export class Notifications {
    static getNotificationsByUser = async (dto: RequestReceptor) => {
        const clientPg = getPoolDB();
        const result = await ReceptoresRepositories.findNotificacionByIdReceptor(clientPg, dto);
        const { success, data, error } = ResponseReceptorSchema.safeParse(result.rows);
        if( !success ){
            throw new AppError(`Error al parsear las notificaciones - ${error.message}`, 500);
        };
        return data;
    };
};