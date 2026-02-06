import { z } from "zod";

export const PostSchema = z.object({
    id: z.coerce.number(),
    titulo: z.string().optional(),
    descripcion: z.string(),
    estilos: z.string().optional(),
    usuarioId: z.coerce.number(),
    tipo: z.literal(["reporte", "aviso", "publicidad"]),
    categoriaId: z.coerce.number(),
    lat: z.coerce.number().optional(),
    lon: z.coerce.number().optional(),
    organizacionId: z.coerce.number().optional(),
    link: z.string().optional(),
    ubicacionId: z.coerce.number(),
    totalComentarios: z.coerce.number(),
    totalLikes: z.coerce.number(),
    totalCompartidos: z.coerce.number(),
    activo: z.coerce.boolean().optional(),
    createdAt: z.string(),
    updatedAt: z.string()
});

const PostRepoImagenSchema = z.object({
    imgId: z.number(),
    urlImg: z.string()
});

const ComentarioRepoSchema = z.object({
    comentId: z.coerce.number(),
    comentario:z.string(),
    fecha: z.string(), 
    resComentId: z.coerce.number(),
    usuario: z.string(),
});

const EstadosPostRepoSchema = z.object({
    estadoId: z.coerce.number(),
    estado: z.literal(['asignado','pendiente','en progreso','resuelto']),
    descripcion: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    alias: z.string(),
    editado: z.boolean()
});

export const PostRepoSchema = z.object({
    id: z.coerce.number(),
    tipo: z.string(),
    titulo: z.string(),
    descripcion: z.string(),
    total_comentarios: z.coerce.number(),
    total_likes: z.coerce.number(),
    total_compartidos: z.coerce.number(),
    link: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    fk_categoria_id: z.coerce.number().nullable(),
    alias: z.string(),
    usuario_id: z.coerce.number(),
    estilos: z.string().nullable(),
    lon: z.coerce.number().nullable(),
    lat: z.coerce.number().nullable(),
    ubicacion_id: z.coerce.number().nullable(),
    nombre: z.string().nullable(),
    imagenes: z.array(PostRepoImagenSchema).nullable(),
    comentarios: z.array(ComentarioRepoSchema).nullable().optional(),
    estados: z.array(EstadosPostRepoSchema).optional()
});

export const ListPostRepoSchema = z.array(PostRepoSchema);

export const ListPostSchema = z.array(PostSchema);

export const PostInsertDataRecordSchema = PostSchema.pick({ 
    id: true, 
    createdAt: true 
});

export const PostDeleteDataRecordSchema = PostInsertDataRecordSchema.pick({
    id: true,
    createdAt: true
}).extend({
    usuarioId: z.number()
});

const UbicacionSchema = z.object({
    id: z.number(),
    calle: z.string(),
    colonia: z.string(),
    municipio: z.string(),
    alcaldia: z.string(),
    estado: z.string(),
    direccion: z.string(),
    lat: z.number(),
    lon: z.number(),
    createdAt: z.date(),
    updateAt: z.date(),
    georeverse: z.string()
});

const UbicacionInsertRepoSchema = UbicacionSchema.pick({
    calle: true,
    colonia: true,
    municipio: true,
    alcaldia: true,
    estado: true,
    direccion: true,
    lat: true,
    lon: true,
    georeverse: true
});

// Tipos respuestas API
export const GeoreverseResponseNominatimSchema = z.object({
    display_name: z.string(),
    address: z.object({
        road: z.string(),
        village: z.string().optional(),
        neighbourhood: z.string().optional(),
        state: z.string(),
        postcode: z.string(),
        country: z.string(),
        country_code: z.string()
    })
});

export const GeoreverseResponseMapsSchema = z.object({
    results: z.array(z.object({
        address_components: z.array(z.object({
            long_name: z.string(),
            short_name: z.string(),
            types: z.array(z.string())
        })),
        formatted_address: z.string()
    }))
});

export const CloudinarySuccessResSchema = z.array(z.object({
    asset_id: z.string(),
    public_id: z.string(),
    version: z.number(),
    version_id: z.string(),
    signature: z.string(),
    width: z.number(),
    height: z.number(),
    format: z.string(),
    resource_type: z.string(),
    created_at: z.string(),
    tags: z.array(z.string()),
    pages: z.number(),
    bytes: z.number(),
    type: z.string(),
    etag: z.string(),
    placeholder: z.boolean(),
    url: z.url(),
    secure_url: z.url(),
    asset_folder: z.string(),
    display_name: z.string(),
    original_filename: z.string(),
    api_key: z.string()
}));


export const CategoriasSchema = z.object({
    1: z.string(),
    2: z.string(),
    3: z.string(),
    4: z.string(),
    5: z.string(),
    6: z.string(),
    7: z.string(),
    8: z.string(),
    9: z.string(),
    10: z.string(),
    11: z.string(),
    12: z.string(),
    13: z.string(),
    14: z.string()
});

export const LlmContentToolResponseSchema = z.array(z.object({
    type: z.string(),
    text: z.string()
}));

export const LlmResponseRefiningSchema = z.array(z.object({
    content: LlmContentToolResponseSchema,
    structuredContent: z.object({
        titulo: z.string(),
        descripcion: z.string(),
        categoriaId: z.union([ z.coerce.number()])
    })
})); 

const MessageLLSchema = z.object({
    role: z.literal(["system", "user", "assistant"]),
    content: z.string()
});

export type UbicacionInsertRepo = z.infer<typeof UbicacionInsertRepoSchema>;
export type UbicacionGeoreverse = Pick<Ubicacion, "calle" | 
                                                  "colonia" | 
                                                  "municipio" | 
                                                  "alcaldia" | 
                                                  "estado" | 
                                                  "direccion" | 
                                                  "georeverse">;
export type Post = z.infer<typeof PostSchema>;
export type PostInsertDataRecord = z.infer<typeof PostInsertDataRecordSchema>;
export type PostDeleteDataRecord = z.infer<typeof PostDeleteDataRecordSchema>;
export type Ubicacion = z.infer<typeof UbicacionSchema>
export type CloudinarySuccessResponse = z.infer<typeof CloudinarySuccessResSchema>;
export type MessageLLM = z.infer<typeof MessageLLSchema>;
