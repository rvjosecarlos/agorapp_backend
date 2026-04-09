import  { Router } from "express";
import { errorHandler } from "../middlewares/error.handler.middleware.js";
import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { validateWithZod } from "../middlewares/validate.zod.middleware.js";
import { middlewareCreateEstado, middlewareGetEstado } from "../validators/http/estados.post.validator.js";
import { RequestEstadoPostSchema, RequestObtenerEstadosSchema } from "../validators/schemas/estados.post.schema.validator.js";
import { EstadosPostController } from "../controllers/estados.post.controller.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";

const router = Router();

router.post("/estado-post",
    validateToken,
    middlewareCreateEstado,
    validateRequest,
    validateWithZod(RequestEstadoPostSchema),
    EstadosPostController.create,
    errorHandler
);

router.get("/estados-post/:postId",
    middlewareGetEstado,
    validateRequest,
    validateWithZod(RequestObtenerEstadosSchema),
    EstadosPostController.getEstados,
    errorHandler
);

export default router;