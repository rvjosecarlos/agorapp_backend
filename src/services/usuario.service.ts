import { PoolClient } from "pg";
import { UbicacionRepositories } from "../respositories/ubicacion.repositories.js";
import { GeocodingService } from "./geocoding.service.js";
import { pool } from "../db/index.js";

export class UsuarioServices {
    static createUser = async () => {
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
};

UsuarioServices.createUser();