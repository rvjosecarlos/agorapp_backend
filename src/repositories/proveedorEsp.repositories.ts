import { Pool, PoolClient } from "pg";

export class ProveedorEspRespositories {
    static insertRowProveedorEsp = async (clientPg: PoolClient | Pool , dto) => {
        const { nameService, esp_id } = dto;
        const sql = `INSERT INTO proveedor_esp (nombre, esp_id)
                     VALUES($1, $2)
                     RETURNING id, nombre, esp_id`;
        const values = [nameService, esp_id];
        const result = await clientPg.query(sql, values);
        return result;
    };
};