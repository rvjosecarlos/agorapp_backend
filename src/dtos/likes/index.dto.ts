import z from "zod";
import { Request } from "express";
import { RequestcreateLikeSchema, RequestDeleteLikeSchema } from "../../validators/schemas/likes.schema.validator.js";

export type RequestCreateLike = z.infer<typeof RequestcreateLikeSchema> & Request["user"];
export type RequestDeleteLike = z.infer<typeof RequestDeleteLikeSchema> & Request["user"];
export const ResponseCreateLikeSchema = z.object({
    like_id: z.coerce.number()
});
export const ResponseDeleteLikeSchema = z.object({
    like_id: z.coerce.string()
});