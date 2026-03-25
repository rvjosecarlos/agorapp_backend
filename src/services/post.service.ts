import { CreatePostInputDTO } from "../dtos/post/createpost.dto.js";
import { PostRepositories } from "../repositories/post.repositories.js";
import { PostImagenesRepositories } from "../repositories/postImagenes.repositories.js";
import { UbicacionRepositories } from "../repositories/ubicacion.repositories.js";
import { CloudinarySuccessResSchema, ListPostRepoSchema, ListPostSchema, PostInsertDataRecord, PostRepoSchema } from "../types/index.js";
import { uploadImage } from "./cloudinary/cloudinary.services.js";
import { processImage } from "./sharp/media.services.js";
import { getPoolDB } from "../db/index.js";
import { GeocodingService } from "./geocoding.service.js";
import { QueryPostListGlobalDTO, QueryUniquePostGlobalSchemaDTO, RequestUserPostList } from "../dtos/post/readpost.dto.js";
import { UpdatePostDTO } from "../dtos/post/uploadpost.dto.js";
import { DeletePostDTO } from "../dtos/post/detelPost.dto.js";

export class PostServices {
    static createPost = async (dto: CreatePostInputDTO) => {
        // Obtener una conexion del pool para la BD
        const pool = getPoolDB();
        const clientPg = await pool.connect();
        try{
            const { imgs, lat, lon } = dto;
            let ubicacionId:number;
            let postResult: PostInsertDataRecord = { id: 0, createdAt: "" };

            await clientPg.query("BEGIN");
            
            // Geocoding
            if( lat && lon ){
                const ubicacion = await GeocodingService.getAddress(lat, lon);
                ubicacionId = await UbicacionRepositories.insertUbicacion(clientPg, ubicacion);
            };

            // Insertar post
            if( dto.tipo === "reporte" ){
                postResult = await PostRepositories.insertReportPost(clientPg, dto, ubicacionId);
            }
            else if( dto.tipo === "aviso" || dto.tipo === "publicidad" ){
                const postData = { ...dto };
                delete postData.lat;
                delete postData.lon;
                delete postData.imgs;
                postResult = await PostRepositories.insertAvisoPublicacionPost(clientPg, postData, ubicacionId);
            };

            // Procesar imagenes
            if (imgs?.length && postResult.id ) {
                // Redimensionar y bajar el peso
                const arrayBufferImage = await Promise.all( imgs.map(async (img) => processImage(img as Express.Multer.File)));
                
                // Subir a Cloudinary
                const resultImgsUrl = await uploadImage({ arrayBufferImage, tag: "post_image" });
                const { success, data, error } = CloudinarySuccessResSchema.safeParse(resultImgsUrl);
                if (!success) throw new Error(`Error de tipos: ${error.message}`);
                const imgUrls = data;

                // Insertar imagenes
                await PostImagenesRepositories.insertImagenes(clientPg, imgUrls, postResult);
            };
            await clientPg.query("COMMIT");

            return postResult;
        }
        catch(error){
            if( clientPg ) await clientPg.query("ROLLBACK");
            if( error instanceof Error ) throw new Error(`Error en PostServices - ${error.message}`);
        }
        finally{
            if( clientPg ) clientPg.release();
        };
    };

    static getPostList = async (dto: QueryPostListGlobalDTO) => {
        const postList = await PostRepositories.findPostList(dto);
        const { data, success, error } = ListPostRepoSchema.safeParse(postList);
        if( !success ){
            //throw new Error(`Error al parsear la respuesta ${error}`);
        };
        return postList;
    };

    static getUserPostList = async (dto: RequestUserPostList) => {
        const clientPg = getPoolDB();
        const result = await PostRepositories.findUserPostList(clientPg, dto);
        const { data, success, error } = ListPostRepoSchema.safeParse(result.rows);
        if( !success ){
            //throw new Error(`Error al parsear la respuesta ${error}`);
        };
        return result.rows;
    };

    static getUniquePost = async (dto: QueryUniquePostGlobalSchemaDTO) => {
        const resFindPost = await PostRepositories.findPost(dto);
        const { data, success, error } = ListPostRepoSchema.safeParse(resFindPost);
        if( !success ){
            throw new Error(`Error al parsear la respuesta ${error}`);
        };
        return data;
    };

    static modifyPost = async (dto: UpdatePostDTO) => {
        const pool = getPoolDB();
        const clientPg = await pool.connect();
        try{
            // Limpia las propiedades que no se ajustan al tipo de reporte
            if(dto.tipo === "reporte" && dto.link){
                delete dto.link
            }
            else if( dto.tipo !== "reporte" ){
                delete dto.categoriaId;
            };
            
            const postResult = await PostRepositories.updatePost(clientPg, dto);
            await clientPg.query("COMMIT");
            return postResult;
        }
        catch(error){
            if( clientPg ) await clientPg.query("ROLLBACK");
            if( error instanceof Error ) throw new Error(`Error en Postservices - ${error.message}`);
        }
        finally{
            if( clientPg ) clientPg.release();
        };
    };

    static deletePost = async (dto: DeletePostDTO) => {
        const pool = getPoolDB();
        const clientPg = await pool.connect();
        try{
            const deactivateResult = await PostRepositories.deactivatePost(clientPg, dto);
            await clientPg.query("COMMIT");
            return deactivateResult;
        }   
        catch(error){
            if( clientPg ) await clientPg.query("ROLLBACK");
            if( error instanceof Error ) throw new Error(`Error en servicio de eliminación: ${error.message}`);
        }
        finally{
            if( clientPg ) clientPg.release();
        };
    };
};