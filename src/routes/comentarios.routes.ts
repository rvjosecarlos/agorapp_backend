import { Router } from "express";
import { middlewareCreateComentario, middlewareRequestComments, middlewareRequestReplyComments } from "../validators/http/comentario.validator.js";
import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { errorHandler } from "../middlewares/error.handler.middleware.js";
import { validateWithZod } from "../middlewares/validate.zod.middleware.js";
import { ComentarioController } from "../controllers/comentarios.controller.js";
import { RequestComentariosSchema, RequestCreateComentarioSchema, RequestReplyCommentSchema } from "../validators/schemas/comentario.schema.validator.js";

const router = Router();

router.post("/post/:postId/:createdAt/comentario",
    middlewareCreateComentario,
    validateRequest,
    validateWithZod(RequestCreateComentarioSchema),
    ComentarioController.create,
    errorHandler
);

router.get("/post/:postId/:createdAt/comentarios",
    middlewareRequestComments,
    validateRequest,
    validateWithZod(RequestComentariosSchema),
    ComentarioController.getComments,
    errorHandler
);

router.get("/post/:postId/:createdAt/comentarios/:replyCommentId",
    middlewareRequestReplyComments,
    validateRequest,
    validateWithZod(RequestReplyCommentSchema),
    ComentarioController.getReplyComments,
    errorHandler
)

export default router;