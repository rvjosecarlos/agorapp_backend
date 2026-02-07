import { body, param, query } from "express-validator";

const middlewareCreateComentario = [
    param("postId")
        .notEmpty().withMessage("Debe especificar un id de post")
        .isInt({ min: 1 }).withMessage("ID no válido")
        .toInt(),
    param("createdAt")
        .notEmpty().withMessage("Debe especificar una fecha de post"),
    body("comentario")
        .notEmpty().withMessage("Debe especificar un comentario"),
    body("usuarioId")
        .notEmpty()
        .isInt()
        .toInt()
        .withMessage("Debe estpecificar un usuario mientras se desarrolla el flujo del token"),
    body("replyCommentId")
        .notEmpty()
        .isInt({ min: 1 })
        .toInt()
        .optional().withMessage("Si esta presente el ID del comentario padre, éste debe ser un número") 
];

const middlewareRequestComments = [
    param("postId")
        .notEmpty().withMessage("Debe especificar un id de post")
        .isInt({ min: 1 }).withMessage("ID no válido")
        .toInt(),
    param("createdAt")
        .notEmpty().withMessage("Debe especificar una fecha de post"),
    query("lastId")
        .isInt({ min: 1 })
        .toInt().withMessage("ID de comentario no válido")
        .optional()
];

const middlewareRequestReplyComments = [ 
    param("replyCommentId")
        .notEmpty().withMessage("El ID del comentario buscado no es válido"),
    ...middlewareRequestComments
];

export { 
    middlewareCreateComentario,
    middlewareRequestComments,
    middlewareRequestReplyComments
}