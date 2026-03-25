import z, { email, optional } from "zod";

export const ResponseAuthUserSchema = z.object({
    id: z.coerce.number(),
    email: z.email(),
    nombre: z.string(),
    apellido: z.string(),
    telefono: z.union([z.string().optional(), z.null()]),
    alias: z.union([z.string().optional(), z.null()]),
    url_img: z.url(),
    created_at: z.string(),
    lon: z.coerce.number().optional(),
    lat: z.coerce.number().optional(),
    esp: z.string().optional(),
    usuario_organizacion_id: z.coerce.number().optional(),
    rol: z.string().optional().nullable()
});