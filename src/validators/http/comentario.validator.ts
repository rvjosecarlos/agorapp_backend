import { body, param, query } from "express-validator";

const middlewareCreateComentario = [
    param("postId")
        .notEmpty().withMessage("Debe especificar un ID de comentario válido")
        .isInt({ min: 1 }).withMessage("ID no válido")
        .toInt(),
    param("createdAt")
        .notEmpty().withMessage("Debe especificar una fecha de comentario válida"),
    body("comentario")
        .notEmpty().withMessage("Debe especificar un comentario"),
    body("postOwnerId")
        .notEmpty()
        .isInt()
        .toInt()
        .withMessage("Debe especificar un id de propietario"),
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
        .isInt({ min: 0 })
        .toInt().withMessage("ID de comentario no válido")
        .optional()
];

const middlewareRequestReplyComments = [ 
    param("replyCommentId")
        .notEmpty().withMessage("El ID del comentario buscado no es válido"),
    ...middlewareRequestComments
];

const middlewareUpdateComment = [ 
    ...middlewareCreateComentario.filter((element, index)=> index <= 2),
    param("commentId")
        .isInt()
        .toInt()
        .withMessage("Debe especificar un ID de comentario válido")
];

const middlewareDeleteComment = [
    param("commentId")
        .isInt({ min: 1 })
        .toInt()
        .notEmpty().withMessage("Debe especificar un ID de comentario válido"),
    param("postId")
        .isInt({ min: 1 })
        .toInt()
        .notEmpty().withMessage("Debe especificar un ID de post válido"),
    param("createdAt")
        .notEmpty().withMessage("Debe especificar una fecha de post válida"),
    /*param("usuarioId")
        .notEmpty().withMessage("Debe especificar un ID de usuario válido")*/
];

export { 
    middlewareCreateComentario,
    middlewareRequestComments,
    middlewareRequestReplyComments,
    middlewareUpdateComment,
    middlewareDeleteComment
}