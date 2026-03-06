import { Router } from "express";
import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { validateWithZod } from "../middlewares/validate.zod.middleware.js";
import { errorHandler } from "../middlewares/error.handler.middleware.js";
import { middlewareProcessPostLLM } from "../validators/http/post.validator.js";
import { UserDescriptionSchema } from "../validators/schemas/post.schema.validator.js";
import { AgenteController } from "../controllers/agente.controller.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";

const router = Router();

router.post("/llm-process-post",
    validateToken,
    middlewareProcessPostLLM,
    validateRequest,
    validateWithZod(UserDescriptionSchema),
    AgenteController.processDescription,
    errorHandler
);

export default router;