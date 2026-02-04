import { z } from "zod";
import { 
    QueryPostListGlobalSchema, 
    QueryUniquePostGlobalSchema 
} from "../../validators/schemas/post.schema.validator.js";

export type QueryPostListGlobalDTO = z.infer<typeof QueryPostListGlobalSchema>;
export type QueryUniquePostGlobalSchemaDTO = z.infer<typeof QueryUniquePostGlobalSchema>;