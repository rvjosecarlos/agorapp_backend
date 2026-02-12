import { TokenPayload } from "google-auth-library";
import { Pool, PoolClient } from "pg";
import { AppError } from "../errors/AppError.js";

export class UsuarioRepositories {
   static findUserByEmail = async (clientPg: Pool | PoolClient, dto: TokenPayload) => {
      const { email } = dto;
      const sql = `SELECT
                     u.email,
                     u.nombre,
                     u.apellido,
                     u.fecha_nacimiento,
                     u.telefono,
                     u.alias,
                     u.url_img,
                     u.created_at,
                     ST_X(location.geom:: geometry) AS lon,
                     ST_Y(location.geom:: geometry) AS lat,
                     p.nombre
                  FROM
                     usuario u
                  LEFT JOIN
                     ubicacion location
                  ON u.fk_ubicacion_id = location.id
                  JOIN 
                     proveedor_esp p
                  ON u.fk_proveedor_esp_id = p.id
                  WHERE u.email = $1`;
      const values = [email];
      const result = await clientPg.query(sql, values);
      return result;
   };

   static insertNewUser = async (clientPg: Pool | PoolClient, dto: TokenPayload & { proveedorEspId: number }) => {
      const { proveedorEspId, email, given_name, family_name, picture } = dto;
      const sql = `INSERT INTO usuario ( fk_proveedor_esp_id, email, nombre, apellido, url_img )
                   VALUES( $1, $2, $3, $4, $5 )
                   RETURNING id, email, nombre, apellido, url_img`;
      const values = [proveedorEspId, email, given_name, family_name, picture];
      const result = await clientPg.query(sql, values);
      return result;
   };
};