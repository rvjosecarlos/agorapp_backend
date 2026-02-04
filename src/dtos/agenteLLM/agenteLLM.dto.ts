import z from "zod";
import { UserDescriptionSchema } from "../../validators/schemas/post.schema.validator.js";

export type UserDescription = z.infer<typeof UserDescriptionSchema>; 