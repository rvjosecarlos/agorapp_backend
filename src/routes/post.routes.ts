import { Router } from "express";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";
import { 
    middlewareDeletePost, 
    middlewareRequestPostValidator, 
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
    UpdatePostSchema 
} from "../validators/schemas/post.schema.validator.js";
import { errorHandler } from "../middlewares/error.handler.middleware.js";

const router = Router();

router.post("/posts",
    uploadMiddleware,
    middlewaresPostValidator,
    validateRequest,
    validateWithZod(CreatePostGlobalSchema),
    PostController.create,
    errorHandler
);

router.get("/post",
    middlewareRequestPostValidator,
    validateRequest,
    validateWithZod(QueryPostListGlobalSchema),
    PostController.getPosts,
    errorHandler
);

router.get("/post/:id",
    middlewareUniquePostRequestValidator,
    validateRequest,
    validateWithZod(QueryUniquePostGlobalSchema),
    PostController.getPost,
    errorHandler
);

router.patch("/post/:id",
    middlewareUpdatePost,
    validateRequest,
    validateWithZod(UpdatePostSchema),
    PostController.upload,
    errorHandler
);

router.delete("/post/:id",
    middlewareDeletePost,
    validateRequest,
    validateWithZod(DeletePostSchema),
    PostController.delete,
    errorHandler
);

export default router;