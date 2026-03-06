import { body } from "express-validator";

const middlewareUpdateUserValidator = [
    body("nombre")
        .notEmpty()
        .trim()
        .withMessage("Nombre no válido"),
    body("apellido")
        .notEmpty()
        .trim()
        .withMessage("Apellido no válido"),
    body("fechaNacimiento")
        .isDate().withMessage("Fecha no válida")
        .optional(),
    body("telefono")
        .isNumeric().withMessage("Teléfono no válido")
        .optional(),
    body("alias")
        .notEmpty()
        .isString()
        .trim()
        .custom((value, { req }) => {
            const alias = req.body.alias;
            const regExp = new RegExp(/[a-zA-Z0-9]{8}/g);
            return alias ? regExp.test(alias) : false;
        })
];

export { middlewareUpdateUserValidator };