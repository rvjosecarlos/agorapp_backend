import z from "zod";
import { RequestReplyCommentSchema } from "../../validators/schemas/comentario.schema.validator.js";

export type RequestReplyComments = z.infer<typeof RequestReplyCommentSchema>;
export const ResponseReplyCommentSchema = z.array(z.object({
    id: z.number(),
    comentario: z.string(),
    created_at: z.string(),
    alias: z.string(),
    url_img: z.string()
}));