import { Request, Response, NextFunction } from "express";
import { AgenteServices } from "../services/agente.service.js";
import { UserDescription } from "../dtos/agenteLLM/agenteLLM.dto.js";

export class AgenteController {
    static processDescription = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.validateRequestData as UserDescription;
            const serviceResponse = await AgenteServices.refiningDescription(dto);
            res.status(200).json({
                success: true,
                message: "Refinado",
                errors: [],
                data: serviceResponse
            });
        }
        catch( error ){
            next(error);
        };
    };
};