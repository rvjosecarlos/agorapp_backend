import z from "zod";
import { RequestDeleteCommentSchema } from "../../validators/schemas/comentario.schema.validator.js";

export type RequestDeleteComment = z.infer<typeof RequestDeleteCommentSchema>;