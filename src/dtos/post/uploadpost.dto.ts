import { z } from "zod";
import { UpdatePostSchema } from "../../validators/schemas/post.schema.validator.js"; 

export type UpdatePostDTO = z.infer<typeof UpdatePostSchema>;