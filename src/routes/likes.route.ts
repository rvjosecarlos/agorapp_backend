import { Router } from "express";
import { middlewareRequestCreateLike, middlewareRequestDeleteLike } from "../validators/http/likes.validator.js";
import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { validateWithZod } from "../middlewares/validate.zod.middleware.js";
import { RequestcreateLikeSchema, RequestDeleteLikeSchema } from "../validators/schemas/likes.schema.validator.js";
import { LikeController } from "../controllers/likes.controller.js";
import { errorHandler } from "../middlewares/error.handler.middleware.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";

const router = Router();

router.post("/like",
    validateToken,
    middlewareRequestCreateLike,
    validateRequest,
    validateWithZod(RequestcreateLikeSchema),
    LikeController.create,
    errorHandler
);

router.delete("/like",
    validateToken,
    middlewareRequestDeleteLike,
    validateRequest,
    validateWithZod(RequestDeleteLikeSchema),
    LikeController.delete,
    errorHandler
);

export default router;