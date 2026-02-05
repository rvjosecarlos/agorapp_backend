import  { Router } from "express";
import { errorHandler } from "../middlewares/error.handler.middleware.js";
import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { validateWithZod } from "../middlewares/validate.zod.middleware.js";
import { middlewareCreateEstado } from "../validators/http/estados.post.validator.js";
import { RequestEstadoPostSchema } from "../validators/schemas/estados.post.schema.validator.js";
import { EstadosPostController } from "../controllers/estados.post.controller.js";

const router = Router();

router.post("/estado-post",
    middlewareCreateEstado,
    validateRequest,
    validateWithZod(RequestEstadoPostSchema),
    EstadosPostController.create,
    errorHandler
);

export default router;