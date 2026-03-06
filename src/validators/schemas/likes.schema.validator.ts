import z from "zod";

export const RequestcreateLikeSchema = z.object({
    postId: z.coerce.number(),
    postCreatedAt: z.string()
});

export const RequestDeleteLikeSchema = z.object({
    likeId: z.coerce.number()
});