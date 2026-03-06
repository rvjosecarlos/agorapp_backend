import z from "zod";

const RequestCreateComentarioSchema = z.object({
    postId: z.coerce.number(),
    createdAt: z.string(),
    comentario: z.string(),
    userId: z.coerce.number(),
    replyCommentId: z.number().optional()
});

const RequestComentariosSchema = RequestCreateComentarioSchema.pick({
    postId: true,
    createdAt: true
}).extend({
    lastId: z.coerce.number().optional()
});

const RequestReplyCommentSchema = RequestComentariosSchema.pick({
    postId: true,
    createdAt: true,
    lastId: true
}).extend({
    replyCommentId: z.coerce.number()
});

const RequestUpdateCommentSchema = RequestCreateComentarioSchema.pick({
    postId: true,
    createdAt: true,
    comentario: true,
    userId: true, 
    replyCommentId: true
}).extend({
    commentId: z.coerce.number()
});

const RequestDeleteCommentSchema = RequestUpdateCommentSchema.pick({
    postId: true,
    createdAt: true,
    commentId: true,
    userId: true 
});

export { 
    RequestCreateComentarioSchema,
    RequestComentariosSchema,
    RequestReplyCommentSchema,
    RequestUpdateCommentSchema,
    RequestDeleteCommentSchema
};