import { Router } from "express";
import { middlewareCreateComentario, middlewareDeleteComment, middlewareRequestComments, middlewareRequestReplyComments, middlewareUpdateComment } from "../validators/http/comentario.validator.js";
import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { errorHandler } from "../middlewares/error.handler.middleware.js";
import { validateWithZod } from "../middlewares/validate.zod.middleware.js";
import { ComentarioController } from "../controllers/comentarios.controller.js";
import { RequestComentariosSchema, RequestCreateComentarioSchema, RequestDeleteCommentSchema, RequestReplyCommentSchema, RequestUpdateCommentSchema } from "../validators/schemas/comentario.schema.validator.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";

const router = Router();

router.post("/post/:postId/:createdAt/comentario",
    validateToken,
    middlewareCreateComentario,
    validateRequest,
    validateWithZod(RequestCreateComentarioSchema),
    ComentarioController.create,
    errorHandler
);

router.get("/post/:postId/:createdAt/comentarios",
    validateToken,
    middlewareRequestComments,
    validateRequest,
    validateWithZod(RequestComentariosSchema),
    ComentarioController.getComments,
    errorHandler
);

router.get("/post/:postId/:createdAt/comentarios/:replyCommentId",
    validateToken,
    middlewareRequestReplyComments,
    validateRequest,
    validateWithZod(RequestReplyCommentSchema),
    ComentarioController.getReplyComments,
    errorHandler
);

router.put("/post/:postId/:createdAt/comentario/:commentId",
    validateToken,
    middlewareUpdateComment,
    validateRequest,
    validateWithZod(RequestUpdateCommentSchema),
    ComentarioController.update,
    errorHandler
);

router.delete("/post/:postId/:createdAt/comentario/:commentId", // el usuario debe venir en el header
    validateToken,
    middlewareDeleteComment,
    validateRequest,
    validateWithZod(RequestDeleteCommentSchema),
    ComentarioController.delete,
    errorHandler
);


export default router;