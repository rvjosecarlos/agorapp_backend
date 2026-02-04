import { cloudinary } from "../../config/cloudinary.config.js";

type Tag = {
    arrayBufferImage: Buffer<ArrayBufferLike>[],
    tag: "post_image" | "profile_image" | "entity_image"
}

export const uploadImagePost = async ({ arrayBufferImage, tag }: Tag) => {
    const imgsUrls = Promise.all( arrayBufferImage.map((imgBuffer) => {

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({ 
                folder: `${process.env.CLOUDINARY_FOLDER}_${new Date().getFullYear()}`,
                resource_type: "image",
                unique_filename: true,
                allowed_formats: ["webp"],
                tags: [tag]
            }, 
            (error, result) => {
                if( error ){
                    console.log("reject", error);
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