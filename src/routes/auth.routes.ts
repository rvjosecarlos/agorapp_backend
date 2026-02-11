import { Router } from "express";

const router = Router();

router.post("/auth-receiver/google-callback", (req, res, next) => {
    console.log({ req });
});

export default router;