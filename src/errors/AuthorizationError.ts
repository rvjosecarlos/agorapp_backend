import { AppError } from "./AppError.js";

export class AuthorizationError extends AppError {
    constructor(message: string){
        super(message, 403);
    };
};