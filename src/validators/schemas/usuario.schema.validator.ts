import z from "zod";

export const RequestUpdateUserSchema = z.object({
    userId: z.coerce.number(),
    nombre: z.string(), 
    apellido: z.string(),
    fechaNacimiento: z.date().optional(),
    telefono: z.string().optional(),
    alias: z.string()
});

export const RequestDeleteUserSchema = z.object({
    userId: z.coerce.number()
});