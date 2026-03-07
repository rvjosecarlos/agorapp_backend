import z from "zod";

export const RequestcreateLikeSchema = z.object({
    postId: z.coerce.number(),
    postCreatedAt: z.string()
});

export const RequestDeleteLikeSchema = RequestcreateLikeSchema.pick({
    postId: true,
    postCreatedAt: true
}).extend({
    likeId: z.coerce.number()
});