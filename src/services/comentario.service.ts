import { getPoolDB } from "../db/index.js";
import { ComentarioRepositories } from "../respositories/comentario.repositorie.js";

export class ComentarioService {
    static crearComentario = async (dto) => {
        const poolClient = getPoolDB();
        const comentario = ComentarioRepositories.insertComment(poolClient, dto);
    };
};