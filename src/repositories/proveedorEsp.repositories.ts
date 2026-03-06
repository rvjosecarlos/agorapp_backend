import { Pool, PoolClient } from "pg";
import { NewUserProveedorEsp } from "../types/index.js";

export class ProveedorEspRespositories {
    static insertRowProveedorEsp = async (clientPg: PoolClient | Pool , dto: NewUserProveedorEsp) => {
        const { nameService, espId } = dto;
        const sql = `INSERT INTO proveedor_esp (nombre, esp_id)
                     VALUES($1, $2)
                     RETURNING id, nombre, esp_id`;
        const values = [nameService, espId];
        const result = await clientPg.query(sql, values);
        return result;
    };
};