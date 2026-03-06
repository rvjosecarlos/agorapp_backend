import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";

export const errorHandler = (error: AppError | Error, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 0;
    let message = "";
    if (error instanceof AppError){  
        message = error.message; 
        statusCode = error.statusCode 
    }
    else if( error instanceof jwt.TokenExpiredError ){
        message = error.message;
        statusCode = 401;
    }
    else{
        message = error.message;
        statusCode = 500;
    };

    res.status(statusCode).json({
        success: false,
        message: "",
        errors:[{
            msg: message
        }],
        data: null
    }); 
};