import { Request, Response, NextFunction } from "express";
import { UsuarioServices } from "../services/usuario.service.js";
import { RequestDeleteUser, RequestUpdateProfileImg, RequestUpdateUser } from "../dtos/usuario/index.dto.js";
import { RefreshTokenService } from "../services/refresh.token.service.js";

export class UserController {
    static getUser = async ( req: Request, res: Response, next: NextFunction ) => {
        try{
            const { userId } = req.user;
            const serverResponse = await UsuarioServices.getUserById(userId);
            return res.status(200).json({
                success: true,
                message: "Usuario obtenido",
                errors: [],
                data: serverResponse
            });
        }
        catch( error ){
            next(error);
        };
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.validateRequestData as RequestUpdateUser;
            const serverResponse = await UsuarioServices.modifyUser(dto);
            res.status(200).json({
                success: true,
                message: "Usuario actualizado",
                errors: [],
                data: serverResponse
            });
        }
        catch(error){
            next(error);
        };
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.validateRequestData as RequestDeleteUser;
            const refreshToken = req.cookies.refresh_token;
            const deleteRefreshToken = await RefreshTokenService.deleteRefreshToken(refreshToken);
            const serverResponse = await UsuarioServices.deleteUser(dto);
            res.clearCookie("jwt")
               .clearCookie("refresh_token")
               .status(200)
               .json({
                success: true,
                message: "Usuario eliminado",
                errors: [],
                data: serverResponse
            });
        }
        catch(error){
            next(error);
        };
    };

    static updateImg = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.validateRequestData as RequestUpdateProfileImg;
            const serverResponse = await UsuarioServices.uploadProfileImage(dto);
            res.status(200).json({
                success: true,
                message: "Imagen de perfil actualizada",
                errors: [],
                data: serverResponse
            });
        }
        catch(error){
            next(error);
        };
    };
};