import z from "zod";
import { RequestEstadoPostSchema } from "../../validators/schemas/estados.post.schema.validator.js";

export type RequestEstadosPost = z.infer<typeof RequestEstadoPostSchema>;