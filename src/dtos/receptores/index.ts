import z from "zod";
import { 
    RequestDeleteReceptorSchema,
    RequestInsertReceptorSchema,
    RequestReceptorSchema,
    RequestUpdateLeidoSchema
} from "../../validators/schemas/receptores.schema.validator.js";

export type RequestDeleteReceptor = z.infer<typeof RequestDeleteReceptorSchema>;
export type RequestInsertReceptor = z.infer<typeof RequestInsertReceptorSchema>;
export type RequestReceptor = z.infer<typeof RequestReceptorSchema>;
export type RequestUpdateLeidoReceptor = z.infer<typeof RequestUpdateLeidoSchema>;

export const ResponseInsertReceptorSchema = z.object({
    receptor_id: z.coerce.number()
});
export const ResponseReceptorSchema = z.array(z.object({
    leido: z.coerce.boolean(),
    titulo: z.string(),
    descripcion: z.string(),
    tipo: z.string(),
    post_id: z.coerce.number(),
    receptor_id: z.coerce.number(),
    post_created_at: z.string(),
    notification_created_at: z.string()
})).optional();
export const ResponseReceptorLeidoSchema = z.object({
    receptor_id: z.coerce.number()
});