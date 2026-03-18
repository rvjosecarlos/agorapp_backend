import z from "zod";
import { Request } from "express";
import { RequestcreateLikeSchema, RequestDeleteLikeSchema } from "../../validators/schemas/likes.schema.validator.js";

export type RequestCreateLike = z.infer<typeof RequestcreateLikeSchema>;
export type RequestDeleteLike = z.infer<typeof RequestDeleteLikeSchema>;
export const ResponseCreateLikeSchema = z.object({
    like_id: z.coerce.number(),
    post_id: z.coerce.number(),
    owner_id: z.coerce.number(),
    titulo: z.string(),
    tipo: z.string(),
    updated_at: z.string(),
    created_at: z.string()
});
export const ResponseDeleteLikeSchema = ResponseCreateLikeSchema.pick({
    like_id: true,
    post_id: true,
    updated_at: true
});