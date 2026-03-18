import { body } from "express-validator";

const middlewareRequestCreateToken = [
    body("pushToken")
        .notEmpty().withMessage("Debe especificar un web push token")
        .isString().withMessage("Token no válido")
        .isLength({ min: 40 }).withMessage("Token no válido"),
    body("platform")
        .notEmpty().withMessage("Debe especificar una plataforma")
        .isString().withMessage("Plataforma no válida")
];

export { middlewareRequestCreateToken };