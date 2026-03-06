import { Router } from "express";
import { AuthGoogleController } from "../controllers/auth.controller.js";
import { errorHandler } from "../middlewares/error.handler.middleware.js";
import { middlewareAuthLogin } from "../validators/http/auth.validator.js";
import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { validateWithZod } from "../middlewares/validate.zod.middleware.js";
import { RequestAuthSchema } from "../validators/schemas/auth.schema.validator.js";
import { RefreshTokenController } from "../controllers/refresh.token.controller.js";

const router = Router();

router.get("/auth-google", 
    AuthGoogleController.login,
    errorHandler
);

router.post("/auth-receiver/google-callback",
    middlewareAuthLogin,
    validateRequest,
    validateWithZod(RequestAuthSchema),
    AuthGoogleController.callbackGoogle,
    errorHandler
);

router.get("/logout", 
    AuthGoogleController.logout,
    errorHandler
);

router.get("/auth-refresh", 
    RefreshTokenController.getNewToken,
    errorHandler
);

export default router;