import z from "zod";
import { Request } from "express";
import { RequestDeleteCommentSchema } from "../../validators/schemas/comentario.schema.validator.js";

export type RequestDeleteComment = z.infer<typeof RequestDeleteCommentSchema> & { usuarioOrganizacionId?: number };