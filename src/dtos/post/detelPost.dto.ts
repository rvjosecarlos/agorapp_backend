import { z } from "zod";
import type { DeletePostSchema } from "../../validators/schemas/post.schema.validator.js"; 

export type DeletePostDTO = z.infer<typeof DeletePostSchema>;