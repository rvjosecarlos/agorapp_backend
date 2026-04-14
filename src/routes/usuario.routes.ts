import { Router } from "express";
import { validateToken } from "../middlewares/validateToken.middleware.js";
import { errorHandler } from "../middlewares/error.handler.middleware.js";
import { UserController } from "../controllers/user.controller.js";
import { middlewareUpdateUserValidator } from "../validators/http/usuario.validator.js";
import { validateWithZod } from "../middlewares/validate.zod.middleware.js";
import { RequestDeleteUserSchema, RequestUpdateProfileImgSchema, RequestUpdateUserSchema } from "../validators/schemas/usuario.schema.validator.js";
import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/usuario", 
    validateToken,
    UserController.getUser,
    errorHandler
);

router.put("/usuario",
    validateToken,
    middlewareUpdateUserValidator,
    validateRequest,
    validateWithZod(RequestUpdateUserSchema),
    UserController.update,
    errorHandler
);

router.delete("/usuario",
    validateToken,
    validateWithZod(RequestDeleteUserSchema),
    UserController.delete,
    errorHandler
);

router.patch("/usuario/img", 
    validateToken,
    uploadMiddleware,
    validateWithZod(RequestUpdateProfileImgSchema),
    UserController.updateImg,
    errorHandler
);

export default router;