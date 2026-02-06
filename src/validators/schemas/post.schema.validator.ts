import { z } from "zod";

export const imgMulterSchema = z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    size: z.number(),
    buffer: z.any()
});

const CreatePostSchema = z.object({
    titulo: z.string().optional(),
    descripcion: z.string(),
    usuarioId: z.number(), // DEBE DE VENIR EN EL TOKEN
    estilos: z.string().optional()
});

export const CreatePostReporteSchema = CreatePostSchema.extend({
    tipo: z.literal("reporte"),
    categoriaId: z.number(),
    lat: z.number(),
    lon: z.number(),
    imgs: z.array(imgMulterSchema)
});

export const CreatePostAvisoSchema = CreatePostSchema.extend({
    tipo: z.literal("aviso"),
    organizacionId: z.number(),
    lat: z.number().optional(),
    lon: z.number().optional(),
    imgs: z.array(imgMulterSchema).optional(),
    link: z.string().optional()
});

export const CreatePostPublicidadSchema = CreatePostSchema.extend({
    tipo: z.literal("publicidad"),
    organizacionId: z.number(),
    lat: z.number().optional(),
    lon: z.number().optional(),
    imgs: z.array(imgMulterSchema),
    link: z.string().optional()
});

export const CreatePostGlobalSchema = z.discriminatedUnion("tipo", [
    CreatePostReporteSchema,
    CreatePostAvisoSchema,
    CreatePostPublicidadSchema
]);

export const QueryPostListGlobalSchema = z.object({
    lat: z.string(),
    lon: z.string(),
    distancia: z.string(),
    lastId: z.coerce.number().int().optional(),
    lastPostDate: z.coerce.date().optional()
});

export const QueryUniquePostGlobalSchema = z.object({
    id: z.number(),
    createdAt: z.string()
});

export const UpdatePostSchema = CreatePostSchema.pick({
    usuarioId: true, // DEBE DE VENIR EN EL TOKEN
    //titulo: true,
    descripcion: true,
    estilos: true
}).extend( {
    tipo: z.union([
        z.literal("reporte"),
        z.literal("aviso"),
        z.literal("publicidad")
    ]),
    id: z.number(),
    createdAt: z.string(),
    categoriaId: z.number().optional(),
    link: z.string().optional()
});

export const DeletePostSchema = UpdatePostSchema.pick({
    id: true,
    createdAt: true,
    // AGREGAR USUARIO AQUI; TEMPORALMENTE ESTA COMO EXTEND
}).extend({
    usuarioId: z.string().transform(Number) // DEBE DE VENIR EN EL TOKEN
});

export const UserDescriptionSchema = z.object({
    description: z.string()
});