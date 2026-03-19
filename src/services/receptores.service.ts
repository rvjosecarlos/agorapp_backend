import { getPoolDB } from "../db/index.js";
import { RequestDeleteReceptor, RequestUpdateLeidoReceptor, ResponseReceptorLeidoSchema } from "../dtos/receptores/index.js";
import { AppError } from "../errors/AppError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ReceptoresRepositories } from "../repositories/receptores.repositories.js";

export class ReceptoresService {
    static updateLeido = async (dto: RequestUpdateLeidoReceptor) => {
        const clientPg = getPoolDB();
        const result = await ReceptoresRepositories.updateReceptorLeido(clientPg, dto);
        if( !result.rowCount ){
            throw new NotFoundError(`Recurso no encontrado`);
        };
        const { success, data, error } = ResponseReceptorLeidoSchema.safeParse(result.rows[0]);
        if( !success ){
            throw new AppError(`Error al parsear receptores update leido ${error.message}`, 500);
        };
        return data;
    };

    static deleteNotificacionReceptor = async (dto: RequestDeleteReceptor) => {
        const clientPg = getPoolDB();
        const result = await ReceptoresRepositories.deleteReceptor(clientPg, dto);
        if( !result.rowCount ){
            throw new NotFoundError("Recurso no encontrado");
        };
        const { success, data, error } = ResponseReceptorLeidoSchema.safeParse(result.rows[0]);
        if( !success ){
            throw new AppError(`Error al parsear result delete receptor`, 500);
        };
        return data;
    };  
};