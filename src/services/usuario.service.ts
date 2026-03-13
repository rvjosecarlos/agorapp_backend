import { Pool, PoolClient } from "pg";
import { UbicacionRepositories } from "../repositories/ubicacion.repositories.js";
import { GeocodingService } from "./geocoding.service.js";
import { getPoolDB } from "../db/index.js";
import { CloudinarySuccessResSchema, Usuario, UsuarioRefreshSchema, UsuarioSchema } from "../types/index.js";
import { UsuarioRepositories } from "../repositories/usuario.repositorio.js";
import { RequestDeleteUser, RequestUpdateProfileImg, RequestUpdateUser, ResponseDeleteUser, ResponseUpdateProfileImg, ResponseUpdateUser } from "../dtos/usuario/index.dto.js";
import { AppError } from "../errors/AppError.js";
import { processImage } from "./sharp/media.services.js";
import { uploadImage } from "./cloudinary/cloudinary.services.js";

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

    static uploadProfileImage = async (dto: RequestUpdateProfileImg) => {
        const clientPg = getPoolDB();
        const {  imgs } = dto;
        const userId = 11;
        
        const arrayBufferImage = await processImage(imgs[0] as Express.Multer.File);
        const resultImgsUrl = await uploadImage({ 
            arrayBufferImage: [arrayBufferImage], 
            tag: "profile_image", 
            public_id: `profile_img_user_${userId}` 
        }); 
       
        const { success: successUpload, data: dataUpload, error: errorUpload } = CloudinarySuccessResSchema.safeParse(resultImgsUrl);
        if (!successUpload) throw new Error(`Error al parsear el resultado de subida: ${errorUpload.message}`);
        const imgUrls = dataUpload;
       
        const result = await UsuarioRepositories.updateProfileImage(clientPg, { userId, urlImg: imgUrls[0].secure_url });
        const { success, data, error } = ResponseUpdateProfileImg.safeParse(result.rows[0]);
        if( !success ){
            throw new AppError(`Error al parsear los datos de imagen de perfil - ${error.message}`, 500);
        };
        return data;
    };
};