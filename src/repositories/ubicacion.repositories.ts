import { PoolClient } from "pg";
import { UbicacionInsertRepo } from "../types/index.js";

export class UbicacionRepositories {
    static insertUbicacion = async (clientPg: PoolClient, ubicacion: UbicacionInsertRepo) => {
        const sql = `INSERT INTO 
                        ubicacion (calle, colonia, municipio, alcaldia, estado, direccion, service_georeverse, geom) 
                        VALUES ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_MakePoint($9, $8), 4326)::geography )
                    RETURNING id`;
            
        const values = Object.values(ubicacion);

        const result = await clientPg.query(sql, values);
        return result.rows[0].id as number;
    };
};