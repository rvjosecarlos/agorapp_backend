import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export const errorHandler = (error: AppError | Error, req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message } = error instanceof AppError ? 
                                    { message: error.message, statusCode: error.statusCode } 
                                        :
                                    { message: `Internal Server Error: ${error.message}`, statusCode: 500 };
    res.status(statusCode).json({
        success: false,
        message: "",
        errors:[{
            msg: message
        }],
        data: null
    }); 
};