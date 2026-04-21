import { Request, Response, NextFunction } from "express"
import { ZodType } from "zod";

declare global {
    namespace Express {
        interface Request {
            validateRequestData?: unknown
        }
    }
};

export const validateWithZod = (esquema: ZodType) => {
    return ( req: Request, res: Response, next: NextFunction ) => {
        try{
            const result = esquema.safeParse({
                ...req.body,
                ...req.query,
                ...req.params,
                ...req.user,
                ...(req.files && { imgs: req.files })
            });
            if( !result.success ){
                return res.status(400).json({
                    success: false,
                    message: "",
                    errors: [
                        {
                            msg: "Error en el validador de esquemas"
                        },
                        {
                            msg: result.error.message
                        }
                    ],
                    data: null
                });
            };
            req.validateRequestData = result.data;
            console.log("Desde esquemas", result.data);
            next();
        }
        catch(error){
            return res.status(400).json({
                success: false,
                message: "",
                errors: [{
                    msg: `Error ZOD al validar el data input - ${error.message}`
                }],
                data: null
            });
        };
    };
};