import z from "zod";

const RequestCreateComentarioSchema = z.object({
    postId: z.coerce.number(),
    createdAt: z.string(),
    comentario: z.string(),
    usuarioId: z.number(), // SE DEBE QUITAR CUANDO SE ARME EL FLUJO DEL TOKEN
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

export { 
    RequestCreateComentarioSchema,
    RequestComentariosSchema,
    RequestReplyCommentSchema
};