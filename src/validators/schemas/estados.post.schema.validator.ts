import z from "zod";

const RequestEstadoPostSchema = z.object({
    estado: z.literal(['asignado','pendiente','en progreso','resuelto']),
    descripcion: z.string(),
    usuarioOrganizacionId: z.number(), // Temporal, despues se debe obtener del token
    postId: z.number(),
    postCreatedAt: z.string()
})

export {
    RequestEstadoPostSchema
}