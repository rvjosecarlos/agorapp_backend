import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { RefreshTokenService } from "../services/refresh.token.service.js";
import jwt from "jsonwebtoken";

export class RefreshTokenController {
    static getNewToken = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = {
                refreshToken: req.cookies.refresh_token,
                deviceInfo: req.headers["user-agent"]
            };
            if( !dto.refreshToken ) throw new AppError("Token de acceso no válido", 401);
            const serverResponse = await RefreshTokenService.refreshToken(dto);
            res.cookie("jwt", serverResponse, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: Number(process.env.COOKIE_TOKEN_EXPIRATION_TIME)
            }).status(200).json({ success: true, message: "Ok", errors: [], data: null });
        }
        catch(error){
            next(error);
        };
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
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
            next(error);
        };
    };
};