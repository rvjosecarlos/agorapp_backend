import { body, param } from "express-validator";

const middlewareCreateComentario = [
    param("id"),
    param("createdAt"),
    body("comentario"),
    body("usuarioId"),
    body("replyComentId") 
]