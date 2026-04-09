import { cloudinary } from "../../config/cloudinary.config.js";

type uploadImageType = {
    arrayBufferImage: Buffer<ArrayBufferLike>[],
    tag: "post_image" | "profile_image" | "entity_image"
    public_id?: string,
    isAvatar: boolean
}

export const uploadImage = async ({ arrayBufferImage, tag, public_id, isAvatar }: uploadImageType) => {
    const imgsUrls = await Promise.all( arrayBufferImage.map((imgBuffer) => {

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({ 
                folder: `${process.env.CLOUDINARY_FOLDER}_${new Date().getFullYear()}`,
                resource_type: "image",
                unique_filename: true,
                allowed_formats: ["webp"],
                tags: [tag],
                overwrite: true,
                transformation: [
                    {
                        width: isAvatar ? 400 : null,
                        height: isAvatar ? 400 : null,
                        crop: "fill",
                        gravity: "face"
                    }
                ],
                ...{ public_id }
            }, 
            (error, result) => {
                if( error ){
                    reject(error.message);
                }
                else{
                    resolve(result);
                };
            });
            uploadStream.end(imgBuffer);
        });
    }));

    return imgsUrls;
};