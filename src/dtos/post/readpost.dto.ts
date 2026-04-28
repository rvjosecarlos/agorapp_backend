import { z } from "zod";
import { Request } from "express";
import { 
    QueryPostListGlobalSchema, 
    QueryUniquePostGlobalSchema,
    RequestMapPostListSchema
} from "../../validators/schemas/post.schema.validator.js";

export type QueryPostListGlobalDTO = z.infer<typeof QueryPostListGlobalSchema> & Request["user"];
export type RequestUserPostList = Pick<QueryPostListGlobalDTO, "userId" | "lastPostDate">;
export type QueryUniquePostGlobalSchemaDTO = z.infer<typeof QueryUniquePostGlobalSchema> & Request["user"];
export type RequestMapPostList = z.infer<typeof RequestMapPostListSchema>;
export const ResponseMapPostList = z.object({
    id: z.coerce.number(),
    created_at: z.string(),
    titulo: z.string().optional().nullable(),
    descripcion: z.string(),
    direccion: z.string(),
    categoria: z.coerce.number(),
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    tipo: z.string()
});