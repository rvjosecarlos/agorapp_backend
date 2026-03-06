import { body } from "express-validator";

const middlewareCreateEstado = [
    body("estado")
        .notEmpty().withMessage("Debe espeficicar un estado")
        .isIn(['asignado','pendiente','en progreso','resuelto']).withMessage("Estado no válido"),
    body("descripcion")
        .notEmpty().withMessage("Debe especificar una descripcion"),
    /*body("usuarioOrganizacionId") // DEBE DE VENIR EN EL TOKEN
        .notEmpty().withMessage("Debe especificar un id de usuario")
        .isInt().withMessage("Id de usuario no válido")
        .toInt(),*/
    body("postId")
        .notEmpty().withMessage("Debe especificar un id de post")
        .isInt().withMessage("Id de post no válido")
        .toInt(),
    body("postCreatedAt")
        .notEmpty().withMessage("Debe especificar una fecha de post")
];

export {
    middlewareCreateEstado
}