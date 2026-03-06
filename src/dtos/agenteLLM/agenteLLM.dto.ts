import z from "zod";
import { Request } from "express";
import { UserDescriptionSchema } from "../../validators/schemas/post.schema.validator.js";

export type UserDescription = z.infer<typeof UserDescriptionSchema> & Request["user"]; 