import { Request, Response, NextFunction } from "express";
import { AuthGoogleService } from "../services/auth/auth.google.service.js";
export class AuthGoogleController {
    static login = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const url = AuthGoogleService.loginGoogle();
            res.redirect(url);
        }
        catch(error){
            next(error);
        };
    };

    static callbackGoogle = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const googleCode = req.query.code as string;
            console.log({ googleCode });
            const serverResponse = await AuthGoogleService.authenticateOrCreateUser(googleCode);
            res.status(200).json({
                success: true,
                message: "Logueado",
                errors: [],
                data: serverResponse
            });
        }
        catch(error){
            next(error);
        };
    };
};