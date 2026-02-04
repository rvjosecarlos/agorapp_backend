import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
        if( origin === process.env.FRONTEND_URL || origin === process.env.DEV_FRONT || !origin ){
            console.log({ origin });
            callback(null, true)
            return;
        };
        callback(null, false);
    }
};