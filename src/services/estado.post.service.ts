import { getPoolDB } from "../db/index.js";
import { RequestEstadosPost } from "../dtos/estadosPost/createEstadoPost.dto.js";
import { EstadoPostRepositories } from "../respositories/estado.post.repositories.js";

export class EstadoPostService {
    static createEstadoPost = async (dto: RequestEstadosPost) => {
        const pool = getPoolDB();
        const estadoPostResult = EstadoPostRepositories.insertEstadoPost(pool, dto);
        return estadoPostResult;
    }
}