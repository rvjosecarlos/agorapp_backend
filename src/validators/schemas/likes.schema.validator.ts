import z from "zod";

export const RequestcreateLikeSchema = z.object({
    postId: z.coerce.number(),
    postCreatedAt: z.string(),
    alias: z.string(),
});

export const RequestDeleteLikeSchema = RequestcreateLikeSchema.pick({
    postId: true,
    postCreatedAt: true
});