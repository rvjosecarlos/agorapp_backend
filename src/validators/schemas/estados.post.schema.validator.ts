import z from "zod";

const RequestEstadoPostSchema = z.object({
    estado: z.literal(['asignado','pendiente','en progreso','resuelto']),
    descripcion: z.string(),
    postOwnerId: z.coerce.number(),
    alias: z.string(),
    usuarioOrganizacionId: z.number(),
    postId: z.number(),
    postCreatedAt: z.string()
});

const RequestObtenerEstadosSchema = z.object({
    postId: z.coerce.number(),
    createdAt: z.string()
});

export {
    RequestEstadoPostSchema,
    RequestObtenerEstadosSchema
}