import { Router } from "express";
import { middlewareRequestCreateToken, middlewareRequestNotifications } from "../validators/http/notificacion.validator.js";
import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { validateWithZod } from "../middlewares/validate.zod.middleware.js";
import { RequestCreatePushTokenSchema } from "../validators/schemas/notificacion.schema.validator.js";
import { NotificationsController } from "../controllers/notifications.controller.js";
import { errorHandler } from "../middlewares/error.handler.middleware.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";
import { RequestReceptorSchema } from "../validators/schemas/receptores.schema.validator.js";

const router = Router();

router.post("/create-push-token",
    validateToken,
    middlewareRequestCreateToken,
    validateRequest,
    validateWithZod(RequestCreatePushTokenSchema),
    NotificationsController.createToken,
    errorHandler
);

router.get("/notifications", 
    //validateToken,
    middlewareRequestNotifications,
    validateRequest,
    validateWithZod(RequestReceptorSchema),
    NotificationsController.getNotifications,
    errorHandler
);

export default router;