import { Request, Response, NextFunction } from "express";
import { AuthGoogleService } from "../services/auth/auth.google.service.js";
import { RequestAuth } from "../dtos/autenticacion/createNewUserSession.dto.js";
import { RefreshTokenService } from "../services/refresh.token.service.js";
export class AuthGoogleController {
    static login = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const url = AuthGoogleService.loginGoogle();
            res.status(200).json({
                success: true,
                message: "URL generada",
                errors: [],
                data: url
            });
        }
        catch(error){
            next(error);
        };
    };

    static callbackGoogle = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.validateRequestData as RequestAuth;
            const serverResponse = await AuthGoogleService.authenticateOrCreateUser(dto);
            res.cookie("jwt", serverResponse.tokens.token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: Number(process.env.COOKIE_TOKEN_EXPIRATION_TIME)
            })
            .cookie("refresh_token", serverResponse.tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: Number(process.env.COOKIE_REFRESH_EXPIRATION_TIME)
            })
            .status(200).json({
                success: true,
                message: "Logueado",
                errors: [],
                data: serverResponse.userData
            });
        }
        catch(error){
            next(error);
        };
    };

    static logout = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.cookies.refresh_token;
            await RefreshTokenService.deleteRefreshToken(dto);
            res.clearCookie("jwt")
               .clearCookie("refresh_token")
               .status(200).json({
                success: true,
                message: "Token eliminado",
                errors: [],
                data: null
            });
        }
        catch(error){
            res.clearCookie("jwt").clearCookie("refresh_token")
            next(error);
        };
    };
};