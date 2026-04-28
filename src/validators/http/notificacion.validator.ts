import { body, param, query } from "express-validator";

const middlewareRequestCreateToken = [
    body("pushToken")
        .notEmpty().withMessage("Debe especificar un web push token")
        .isString().withMessage("Token sin caracteres válidos")
        .isLength({ min: 10 }).withMessage("Token no válido - min"),
    body("platform")
        .notEmpty().withMessage("Debe especificar una plataforma")
        .isString().withMessage("Plataforma no válida")
];

const middlewareRequestNotifications = [
    query("lastNotificationDate")
        .optional()
        .isString().withMessage("Debe especificar una fecha valida")
];

const middlewareRequestUpdateLeido = [
    body("receptorId")
        .notEmpty().withMessage("Debe proporcionar un Id válido")
        .isNumeric().withMessage("Id de notificación no válido")
        .toInt()
];

const middlewareRequestDeleteReceptor = [
    param("receptorId")
        .notEmpty().withMessage("Debe proporcionar un Id válido")
        .isNumeric().withMessage("Id de notificación no válido")
        .toInt()
];

export { middlewareRequestCreateToken, middlewareRequestNotifications, middlewareRequestUpdateLeido, middlewareRequestDeleteReceptor };