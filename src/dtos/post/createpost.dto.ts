import { z } from "zod";
import { 
    CreatePostReporteSchema, 
    CreatePostAvisoSchema, 
    CreatePostPublicidadSchema,
    imgMulterSchema
} from "../../validators/schemas/post.schema.validator.js";

export type ImgMulter = z.infer<typeof imgMulterSchema>;
export type CreatePostReporteDTO = z.infer<typeof CreatePostReporteSchema>;
export type CreatePostAvisoDTO = z.infer<typeof CreatePostAvisoSchema>;
export type CreatePostPublicidadDTO = z.infer<typeof CreatePostPublicidadSchema>;
export type CreatePostInputDTO = CreatePostReporteDTO | CreatePostAvisoDTO | CreatePostPublicidadDTO;