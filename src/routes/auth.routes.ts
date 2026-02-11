import { Router } from "express";
import { AuthGoogleController } from "../controllers/auth.controller.js";
import { errorHandler } from "../middlewares/error.handler.middleware.js";

const router = Router();

router.get("/auth-google", 
    AuthGoogleController.login,
    errorHandler
);

router.get("/auth-receiver/google-callback",
    AuthGoogleController.callbackGoogle,
    errorHandler
);

export default router;