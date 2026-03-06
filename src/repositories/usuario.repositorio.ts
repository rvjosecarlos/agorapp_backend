import { TokenPayload } from "google-auth-library";
import { Pool, PoolClient } from "pg";
import { AppError } from "../errors/AppError.js";
import { Usuario } from "../types/index.js";
import { RequestDeleteUser, RequestUpdateUser } from "../dtos/usuario/index.dto.js";

export class UsuarioRepositories {
   static findUserByEmail = async (clientPg: Pool | PoolClient, dto: TokenPayload) => {
      const { email } = dto;
      const sql = `SELECT
                     u.id,
                     u.email,
                     u.nombre,
                     u.apellido,
                     u.fecha_nacimiento,
                     u.telefono,
                     u.alias,
                     u.url_img,
                     to_char(u.created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_at,
                     ST_X(location.geom:: geometry) AS lon,
                     ST_Y(location.geom:: geometry) AS lat,
                     esp.nombre AS esp,
                     u_org.id as usuarioOrganizacionId,
                     u.activo
                  FROM
                     usuario u
                  JOIN 
                     proveedor_esp esp
                  ON u.fk_proveedor_esp_id = esp.id
                  LEFT JOIN
                     usuario_organizacion u_org
                  ON
                     u.id = u_org.fk_usuario_id
                  LEFT JOIN 
                     departamento dep
                  ON
                     u_org.fk_departamento_id = dep.id
                  LEFT JOIN
                     ubicacion location
                  ON u.fk_ubicacion_id = location.id
                  WHERE u.email = $1`;
      const values = [email];
      const result = await clientPg.query(sql, values);
      return result;
   };

   static findUserById = async (clientPg: Pool | PoolClient, dto: Usuario["id"]) => {
      const id = dto;
      const sql = `SELECT
                     u.id,
                     u.email,
                     u.nombre,
                     u.apellido,
                     u.fecha_nacimiento,
                     u.telefono,
                     u.alias,
                     u.url_img,
                     to_char(u.created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_at,
                     ST_X(location.geom:: geometry) AS lon,
                     ST_Y(location.geom:: geometry) AS lat,
                     esp.nombre AS esp,
                     u_org.rol,
                     dep.fk_organizacion_id AS organizacionId
                  FROM
                     usuario u
                  JOIN 
                     proveedor_esp esp
                  ON u.fk_proveedor_esp_id = esp.id
                  LEFT JOIN
                     usuario_organizacion u_org
                  ON
                     u.id = u_org.fk_usuario_id
                  LEFT JOIN 
                     departamento dep
                  ON
                     u_org.fk_departamento_id = dep.id
                  LEFT JOIN
                     ubicacion location
                  ON u.fk_ubicacion_id = location.id
                  WHERE u.id = $1`;
      const values = [id];
      const result = await clientPg.query(sql, values);
      return result;
   };



   static insertNewUser = async (clientPg: Pool | PoolClient, dto: TokenPayload & { proveedorEspId: number }) => {
      const { proveedorEspId, email, given_name, family_name, picture } = dto;
      const sql = `INSERT INTO usuario ( fk_proveedor_esp_id, email, nombre, apellido, url_img )
                   VALUES( $1, $2, $3, $4, $5 )
                   RETURNING id, email, nombre, apellido, url_img, to_char(created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_at`;
      const values = [proveedorEspId, email, given_name, family_name, picture];
      const result = await clientPg.query(sql, values);
      return result;
   };

   static updateUser = async (clientPg: Pool | PoolClient, dto: RequestUpdateUser ) => {
      const { nombre, apellido, alias, fechaNacimiento, telefono, userId } = dto;
      const sql = `UPDATE usuario 
                   SET 
                     nombre = $1,
                     apellido = $2,
                     alias = $3,
                     fecha_nacimiento = $4,
                     telefono = $5
                   WHERE id = $6 AND activo = TRUE
                   RETURNING email, nombre, apellido, to_char(fecha_nacimiento, 'YYYY-MM-DD HH24:MI:SS.USOF') AS fecha_nacimiento, alias, telefono`;
      const values = [nombre, apellido, alias, fechaNacimiento ?? null, telefono ?? null, userId];
      const result = await clientPg.query(sql, values);
      return result;
   };

   static deactivateUser = async (clientPg: Pool | PoolClient, dto: RequestDeleteUser) => {
      const { userId } = dto;
      console.log({ userId });
      const sql = `DELETE FROM usuario WHERE id = $1 RETURNING id`;
      const values = [userId];
      const result = await clientPg.query(sql, values);
      return result;
   };
};