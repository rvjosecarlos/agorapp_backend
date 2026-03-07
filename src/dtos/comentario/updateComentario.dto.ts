import z from "zod";
import { Request } from "express";
import { RequestUpdateCommentSchema } from "../../validators/schemas/comentario.schema.validator.js";

export type RequestUpdateComment = z.infer<typeof RequestUpdateCommentSchema> & Request["user"];
export const ResponseUpdateComment = z.object({
    id: z.coerce.number(),
    comentario: z.string(),
    fk_post_id: z.coerce.number(),
    fk_post_created_at: z.string(),
    comment_update_at: z.string()
});