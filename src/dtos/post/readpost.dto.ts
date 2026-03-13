import { z } from "zod";
import { Request } from "express";
import { 
    QueryPostListGlobalSchema, 
    QueryUniquePostGlobalSchema 
} from "../../validators/schemas/post.schema.validator.js";

export type QueryPostListGlobalDTO = z.infer<typeof QueryPostListGlobalSchema> & Request["user"];
export type RequestUserPostList = Pick<QueryPostListGlobalDTO, "userId" | "lastPostDate">;
export type QueryUniquePostGlobalSchemaDTO = z.infer<typeof QueryUniquePostGlobalSchema> & Request["user"];