import z from "zod";
import { RequestComentariosSchema } from "../../validators/schemas/comentario.schema.validator.js";

export type RequestComentarios = z.infer< typeof RequestComentariosSchema >;
export const ResponseComentriosSchema = z.array(z.object({
    id: z.number(),
    comentario: z.string(),
    created_at: z.string(),
    alias: z.string(),
    url_img: z.string()
}));