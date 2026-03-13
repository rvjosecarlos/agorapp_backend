import z from "zod";
import { Usuario } from "../../types/index.js";

export type RequestSendNotification = {
    title: string,
    body: string,
    data: {}
};

export type RequestFindTokens = {
    userId: Usuario["id"], 
    token?: string
};

export const ResponseFindTokens = z.array(z.object({
    token: z.string(),
    last_used_at: z.string()
}));

export type RequestInsertNotification = {
    titulo: string,
    descripcion: string,
    tipo: 'comentario' | 'actualizacion' | 'aviso' | 'like',
    postId?: number,
    createdAt?: string,
}

export const ResponseInsertNotification = z.object({
    id: z.coerce.number(),
    titulo: z.string(),
    descripcion: z.string(),
    tipo: z.string()
});