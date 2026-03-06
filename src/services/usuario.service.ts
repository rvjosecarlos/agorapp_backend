import { Pool, PoolClient } from "pg";
import { UbicacionRepositories } from "../repositories/ubicacion.repositories.js";
import { GeocodingService } from "./geocoding.service.js";
import { getPoolDB } from "../db/index.js";
import { Usuario, UsuarioRefreshSchema, UsuarioSchema } from "../types/index.js";
import { UsuarioRepositories } from "../repositories/usuario.repositorio.js";
import { RequestDeleteUser, RequestUpdateUser, ResponseDeleteUser, ResponseUpdateUser } from "../dtos/usuario/index.dto.js";
import { AppError } from "../errors/AppError.js";

export class UsuarioServices {
    static createUser = async () => {
        const pool = getPoolDB();
        let clientPg: PoolClient;
        try{
            clientPg = await pool.connect();
            await clientPg.query("BEGIN");
            const ubicacion = await GeocodingService.getAddress(19.661223748370304, -99.11208552041286);
            const ubicacionId = await UbicacionRepositories.insertUbicacion(clientPg, ubicacion);
            const usuario = {
                email: "email@email.com",
                nombre: "Carlos",
                apellido: "Rey",
                fecha_nacimiento: new Date(),
                telefono: "1231231113",
                curp: "REVC871014HDFRR04",
                alias: "El chidote",
                url_img: "",
                ubicacionId: ubicacionId
            }

            console.log("Todo ok");
            await clientPg.query("COMMIT");
        }
        catch(error){
            if(clientPg) await clientPg.query("ROLLBACK");
            throw new Error(`Error al crear el usuario - ${error.message}`);
        }
        finally{
            if(clientPg) clientPg.release();
        };
    };

    static getUserById = async (userId: Usuario["id"]) => {
        const clientPg = getPoolDB();
        const usuario = await UsuarioRepositories.findUserById(clientPg, userId);
        const { success, data, error } = UsuarioSchema.safeParse(usuario.rows[0]);
        if( !success ){
            throw new Error(`Error al parsear los datos del usuario - ${error.message}`);
        };
        return data;
    };

    static modifyUser = async (dto: RequestUpdateUser) => {
        const clientPg = getPoolDB();
        const result = await UsuarioRepositories.updateUser(clientPg, dto);
        console.log({ res: result.rows[0] });
        const { success, data, error } = ResponseUpdateUser.safeParse(result.rows[0]);
        if( !success ){
            throw new AppError(`Error al parsear los datos de usuario - ${error.message}`, 500);
        };
        return data;
    };

    static deleteUser = async (dto: RequestDeleteUser) => {
        const clientPg = getPoolDB();
        const result = await UsuarioRepositories.deactivateUser(clientPg, dto);
        const { success, data, error } = ResponseDeleteUser.safeParse(result.rows[0]);
        if( !success ){
            throw new AppError(`Error al parsear los datos de usuario - ${error.message}`, 500);
        };
        return data;
    };
};