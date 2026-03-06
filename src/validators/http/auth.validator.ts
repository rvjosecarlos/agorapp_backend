import { body } from "express-validator";

const middlewareAuthLogin = [
    body("deviceInfo").notEmpty().withMessage("Debe especificar un dispositivo de inicio de sesión"),
    body("code").notEmpty().withMessage("Debe especificar un código válido de esp")
];

export { middlewareAuthLogin };