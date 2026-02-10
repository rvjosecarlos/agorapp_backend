import { Router } from "express";
import { middlewareCreateComentario, middlewareDeleteComment, middlewareRequestComments, middlewareRequestReplyComments, middlewareUpdateComment } from "../validators/http/comentario.validator.js";
import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { errorHandler } from "../middlewares/error.handler.middleware.js";
import { validateWithZod } from "../middlewares/validate.zod.middleware.js";
import { ComentarioController } from "../controllers/comentarios.controller.js";
import { RequestComentariosSchema, RequestCreateComentarioSchema, RequestDeleteCommentSchema, RequestReplyCommentSchema, RequestUpdateCommentSchema } from "../validators/schemas/comentario.schema.validator.js";

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
);

router.put("/post/:postId/:createdAt/comentario/:commentId",
    middlewareUpdateComment,
    validateRequest,
    validateWithZod(RequestUpdateCommentSchema),
    ComentarioController.update,
    errorHandler
);

router.delete("/post/:postId/:createdAt/comentario/:commentId/:usuarioId", // el usuario debe venir en el header
    middlewareDeleteComment,
    validateRequest,
    validateWithZod(RequestDeleteCommentSchema),
    ComentarioController.delete,
    errorHandler
);


export default router;