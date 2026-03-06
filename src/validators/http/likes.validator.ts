import { body, param } from "express-validator";

const middlewareRequestCreateLike = [
    body("postId")
        .notEmpty()
        .isInt()
        .isLength({ min: 1 })
        .toInt()
        .withMessage("ID no post no válido"),
    body("postCreatedAt")
        .notEmpty()
        .withMessage("Fecha no válida")
];

const middlewareRequestDeleteLike = [
    param("likeId")
        .notEmpty()
        .isInt()
        .toInt()
        .withMessage("ID de like no válido")
];

export { middlewareRequestCreateLike, middlewareRequestDeleteLike }