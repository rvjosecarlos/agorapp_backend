import z from "zod";
import { CreatePostReporteSchema } from "./post.schema.validator.js";

export const RequestUpdateUserSchema = z.object({
    userId: z.coerce.number(),
    nombre: z.string(), 
    apellido: z.string(),
    alias: z.string(),
    fechaNacimiento: z.date().optional(),
    telefono: z.string().optional()
});

export const RequestDeleteUserSchema = z.object({
    userId: z.coerce.number()
});

export const RequestUpdateProfileImgSchema = CreatePostReporteSchema.pick({
    userId: true,
    imgs: true
});