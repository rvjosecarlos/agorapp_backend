import z from "zod";
import { RequestEstadoPostSchema, RequestObtenerEstadosSchema } from "../../validators/schemas/estados.post.schema.validator.js";

export type RequestEstadosPost = z.infer<typeof RequestEstadoPostSchema>;
export type RequestObtenerEstados = z.infer<typeof RequestObtenerEstadosSchema>;
export const ResponseObtenerEstados = z.object({
    id: z.coerce.number(),
    estado: z.string(),
    descripcion: z.string(),
    created_at: z.string(),
    editado: z.coerce.boolean(),
    alias: z.string()
});