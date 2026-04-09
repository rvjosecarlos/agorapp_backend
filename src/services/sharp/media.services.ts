import sharp from "sharp";

export const processImage = async ( imgFile: Express.Multer.File ) => {
    console.log("Tamaño imagen", imgFile.size);
    return await sharp(imgFile.buffer)
                .resize({
                    width: 1280,
                    height: 1280,
                    fit: "inside",
                    withoutEnlargement: true
                })
                .webp({ quality: 87 })
                .toBuffer()
};