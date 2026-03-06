import z from "zod";
import { RequestAuthSchema } from "../../validators/schemas/auth.schema.validator.js";

export type RequestAuth = z.infer< typeof RequestAuthSchema >;