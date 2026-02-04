import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if( !result.isEmpty() ){
        const errores = result.array().map( (error) => {
            return {
                msg: error.msg
            };
        });
        return res.status(400).json({
            success: false,
            message: "",
            errors: errores,
            data: null
        });
    };
    next();
};