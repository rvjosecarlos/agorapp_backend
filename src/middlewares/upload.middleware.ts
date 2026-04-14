import multer from "multer";
import { Request, Response, NextFunction } from "express";

const almacenamientoTemporal = multer.memoryStorage();
const upload = multer({ 
    storage: almacenamientoTemporal,
    limits: {
        files: 3,
        fileSize: 20 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        if( file.mimetype.startsWith("image/") ) {
            callback(null, true);
        }
        else{
            callback(new Error("Solo se permiten imagenes"));
        };
    }
});

const uploadMiddleware = (req: Request, res: Response, next: NextFunction ) => {
    upload.array("imgs", 3)( req, res, (error) => {
        if( error ){
            console.log({ error });
            return res.status(400).json({
                success: false,
                message: "",
                errors: [{
                    msg: error.message
                }]
            });
        } 
        else if( (!req.files ||  !req.files.length ) && req.body.tipo === "reporte"  ){
            return res.status(400).json({
                success: false,
                message: "",
                errors: [{
                    msg: "Debe incluir al menos una imagen"
                }]
            });
        };
        next(); 
    });
};

export { uploadMiddleware };