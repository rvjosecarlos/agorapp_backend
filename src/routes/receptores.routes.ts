import { Router } from "express";
import { middlewareRequestDeleteReceptor, middlewareRequestUpdateLeido } from "../validators/http/notificacion.validator.js";
import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { validateWithZod } from "../middlewares/validate.zod.middleware.js";
import { RequestDeleteReceptorSchema, RequestUpdateLeidoSchema } from "../validators/schemas/receptores.schema.validator.js";
import { ReceptoresController } from "../controllers/receptores.controller.js";
import { errorHandler } from "../middlewares/error.handler.middleware.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";
import { ReceptoresService } from "../services/receptores.service.js";

const router = Router();

router.put("/notificacion-receptor",
    validateToken,
    middlewareRequestUpdateLeido,
    validateRequest,
    validateWithZod(RequestUpdateLeidoSchema),
    ReceptoresController.updateLeido,
    errorHandler
);

router.delete("/notificacion-receptor/:receptorId",
    validateToken,
    middlewareRequestDeleteReceptor,
    validateRequest,
    validateWithZod(RequestDeleteReceptorSchema),
    ReceptoresController.delete,
    errorHandler
);

export default router;