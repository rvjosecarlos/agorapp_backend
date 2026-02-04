import { AppError } from "./AppError.js";

export class IAError extends AppError {
    constructor(message: string, statusCode: number){
        const iaerror = "IA_ERROR: " + message;
        super(iaerror, statusCode);
    };
};