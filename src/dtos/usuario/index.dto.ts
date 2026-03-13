import z from "zod";
import { Request } from "express";
import { RequestDeleteUserSchema, RequestUpdateUserSchema, RequestUpdateProfileImgSchema } from "../../validators/schemas/usuario.schema.validator.js";

export type RequestUpdateUser = z.infer<typeof RequestUpdateUserSchema> & Request["user"];
export type RequestDeleteUser = z.infer<typeof RequestDeleteUserSchema>;
export type RequestUpdateProfileImg = z.infer<typeof RequestUpdateProfileImgSchema>;
export const ResponseUpdateUser = z.object({
    nombre: z.string(),
    apellido: z.string(),
    alias: z.string(),
    fecha_nacimiento: z.string().nullable(),
    telefono: z.string().nullable()
});
export const ResponseDeleteUser = z.object({
    id: z.coerce.number()
});
export const ResponseUpdateProfileImg = z.object({
    url_img: z.string(),
});