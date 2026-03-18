import { body, param, query } from "express-validator";

const middlewareRequestCreateLike = [
    body("postId")
        .notEmpty()
        .isInt()
        .isLength({ min: 1 })
        .toInt()
        .withMessage("ID no post no válido"),
    body("postCreatedAt")
        .notEmpty()
        .withMessage("Fecha no válida"),
    body("alias")
        .notEmpty().withMessage("Debe especificar un alias")
];

const middlewareRequestDeleteLike = [ 
    query("postId")
        .notEmpty()
        .isInt()
        .isLength({ min: 1 })
        .toInt()
        .withMessage("ID no post no válido"),
    query("postCreatedAt")
        .notEmpty()
        .withMessage("Fecha no válida")
];

export { middlewareRequestCreateLike, middlewareRequestDeleteLike }