import z from "zod";
import { Request } from "express";
import { RequestCreateComentarioSchema } from "../../validators/schemas/comentario.schema.validator.js";
import { ComentarioRepoSchema } from "../../types/index.js";

export type RequestCreateComentario = z.infer<typeof RequestCreateComentarioSchema> & Request["user"];

export const ResponseCreateComentarioSchema = ComentarioRepoSchema.pick({
    comentId: true,
    comentario: true,
    fecha: true
});

export type ResponseCreateComentario = z.infer<typeof ResponseCreateComentarioSchema>