import { PoolClient } from "pg";
import { CloudinarySuccessResponse, Post, PostInsertDataRecord } from "../types/index.js";

export class PostImagenesRepositories {
    static insertImagenes = async (clientPg: PoolClient, postImgsData: CloudinarySuccessResponse, postResult: PostInsertDataRecord) => {
        try{
            let valueTemplate = "";
            const values: string[] = []
            postImgsData.forEach((img, indice) => {
                const valuePosition = indice * 5;
                valueTemplate += `( $${valuePosition + 1}, $${valuePosition + 2}, $${valuePosition + 3}, $${valuePosition + 4}, $${valuePosition + 5})`;
                if( indice + 1 < postImgsData.length ) valueTemplate += ", ";
                values.push( postResult.id.toString(), postResult.createdAt, img.secure_url, img.asset_id, indice.toString() );
            });
            
            const sql = `INSERT INTO post_imagenes ( fk_post_id, fk_post_created_at, url_img, id_cloudinary, orden )
                         VALUES ${valueTemplate}
                         RETURNING id`;

            const result = await clientPg.query(sql, values);
            return result.rows;
        }
        catch(error){
            if(error instanceof Error)  throw new Error(`Error al insertar las imagenes ${error.message}`);
        };
    };
};