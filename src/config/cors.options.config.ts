import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
        if( 
            origin === process.env.FRONTEND_URL || 
            origin === process.env.DEV_FRONT || 
            origin === process.env.DEV_FRONT_VPN || 
            origin === process.env.DEV_FRONT_NGROK ||
            origin === process.env.DEV_FRONT_LOCAL ||
            origin === process.env.DEV_FRONT_NGROK_YO ||
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