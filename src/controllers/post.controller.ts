import { Request, Response, NextFunction } from "express";
import { PostServices } from "../services/post.service.js";
import { CreatePostInputDTO } from "../dtos/post/createpost.dto.js";
import { QueryPostListGlobalDTO, QueryUniquePostGlobalSchemaDTO, RequestUserPostList } from "../dtos/post/readpost.dto.js";
import { UpdatePostDTO } from "../dtos/post/uploadpost.dto.js";
import { DeletePostDTO } from "../dtos/post/detelPost.dto.js";

export class PostController {
    static getPosts = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dtoInput = req.validateRequestData as QueryPostListGlobalDTO;
            const posts = await PostServices.getPostList(dtoInput);
            console.log(Date.now());
            res.status(200).json({
                success: true,
                message: "Publicaciones obtenidas",
                errors: [],
                data: posts
            });
        }
        catch(error){
            next(error);
        };
    };

    static getUserPost = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.validateRequestData as RequestUserPostList;
            const serverResponse = await PostServices.getUserPostList(dto);
            res.status(200).json({
                success: true,
                message: "Post de usuario obtenidos",
                errors: [],
                data: serverResponse
            });
        }
        catch(error){
            next(error);
        };
    };

    static getPost = async ( req: Request, res: Response, next: NextFunction ) => {
        try{
            const dtoInput = req.validateRequestData as QueryUniquePostGlobalSchemaDTO;
            const post = await PostServices.getUniquePost(dtoInput);
            console.log(Date.now());
            res.status(200).json({
                success: true,
                message: "Publicaciones obtenidas",
                errors: [],
                data: post
            });
        }
        catch(error){
            console.log("ERROR EN EL CONTROLADOR");
            next(error);
        };
    };

    static create = async ( req: Request, res:Response, next: NextFunction ) => {
        try{
            const dtoInput = req.validateRequestData as CreatePostInputDTO;
            const serviceResponse = await PostServices.createPost(dtoInput);
            res.status(201).json({
                success: true,
                message: "Creado",
                errors: [],
                data: serviceResponse
            });
        }
        catch(error){
            next(error);
        };
    };

    static upload = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dtoInput = req.validateRequestData as UpdatePostDTO;
            const serviceResponse = await PostServices.modifyPost(dtoInput);
            res.status(201).json({
                success: true,
                message: "Actualizado",
                errors: [],
                data: serviceResponse
            });
        }
        catch(error){
            next(error);
        }
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = req.validateRequestData as DeletePostDTO;
            const serviceResponse = await PostServices.deletePost(dto);
            res.status(200).json({
                success: true,
                message: "Eliminado",
                errors: [],
                data: null
            });
        }
        catch(error){
            next(error);
        };
    };
};