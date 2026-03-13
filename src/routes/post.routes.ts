import { Router } from "express";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";
import { 
    middlewareDeletePost, 
    middlewareRequestPostValidator, 
    middlewareRequestUserPost, 
    middlewaresPostValidator, 
    middlewareUniquePostRequestValidator, 
    middlewareUpdatePost 
} from "../validators/http/post.validator.js";
import { PostController } from "../controllers/post.controller.js";
import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { validateWithZod } from "../middlewares/validate.zod.middleware.js";
import { 
    CreatePostGlobalSchema, 
    DeletePostSchema, 
    QueryPostListGlobalSchema, 
    QueryUniquePostGlobalSchema, 
    RequestUserPostListSchema, 
    UpdatePostSchema 
} from "../validators/schemas/post.schema.validator.js";
import { errorHandler } from "../middlewares/error.handler.middleware.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";

const router = Router();

router.post("/post",
    validateToken,
    uploadMiddleware,
    middlewaresPostValidator,
    validateRequest,
    validateWithZod(CreatePostGlobalSchema),
    PostController.create,
    errorHandler
);

router.get("/post",
    validateToken,
    middlewareRequestPostValidator,
    validateRequest,
    validateWithZod(QueryPostListGlobalSchema),
    PostController.getPosts,
    errorHandler
);

router.get("/user-post",
    validateToken,
    middlewareRequestUserPost,
    validateRequest,
    validateWithZod(RequestUserPostListSchema),
    PostController.getUserPost,
    errorHandler
);

router.get("/post/:id",
    validateToken,
    middlewareUniquePostRequestValidator,
    validateRequest,
    validateWithZod(QueryUniquePostGlobalSchema),
    PostController.getPost,
    errorHandler
);

router.patch("/post/:id",
    validateToken,
    middlewareUpdatePost,
    validateRequest,
    validateWithZod(UpdatePostSchema),
    PostController.upload,
    errorHandler
);

router.delete("/post/:id",
    validateToken,
    middlewareDeletePost,
    validateRequest,
    validateWithZod(DeletePostSchema),
    PostController.delete,
    errorHandler
);

export default router;