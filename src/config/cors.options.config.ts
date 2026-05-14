import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
        if( 
            origin === process.env.PROD_FRONT || origin === process.env.DEV_FRONT_CLOUDFLARE ||
            !origin 
        ){
            console.log({ origin, date: Intl.DateTimeFormat("es-MX",{ dateStyle: "long", timeStyle: "long" }).format(new Date()) });
            callback(null, true)
            return;
        };
        callback(null, false);
    },
    credentials: true
};