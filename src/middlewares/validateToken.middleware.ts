import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PayloadTokenUserSchema } from "../types/index.js";

declare global {
    namespace Express {
        interface Request {
            user: {
                userId: number,
                alias?: string,
                usuarioOrganizacionId?: number | null
            }
        }
    }
};

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
    try{
        const cookies = req.cookies;
        if( !cookies.jwt || !cookies.refresh_token ) throw new Error("No autorizado");

        const user = jwt.verify(cookies.jwt, process.env.JWT_SECRET);

        const { success, data } = PayloadTokenUserSchema.safeParse(user);
        if( !success ) throw new Error("Token no válido");
        console.log({usuarioToken: data});
        req.user = data;
        next();
    }
    catch(error){
        return res.status(401).json({
            success: false,
            message: "No autorizado",
            errors: [{
                msg: error.message
            }],
            data: null
        })
    };
};