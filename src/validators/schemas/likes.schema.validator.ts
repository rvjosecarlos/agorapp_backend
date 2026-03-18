import z from "zod";

export const RequestcreateLikeSchema = z.object({
    postId: z.coerce.number(),
    postCreatedAt: z.string(),
    alias: z.string(),
    userId: z.coerce.number(),
    organizacionId: z.coerce.number().optional()
});

export const RequestDeleteLikeSchema = RequestcreateLikeSchema.pick({
    postId: true,
    postCreatedAt: true,
    userId: true,
    organizacionId: true
});