import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

const authCient = new OAuth2Client(process.env.GOOGLE_CLIENT_APP_ID, process.env.GOOGLE_OAUTH_SECRET);

export class AuthGoogleService {
    static loginGoogle = () => {
        const url = authCient.generateAuthUrl({
            access_type: "offline",
            scope: ["profile", "email"],
            redirect_uri: process.env.GOOGLE_CALLBACK_URL
        });
        return url;
    };

    static authenticateOrCreateUser = async (googleCode) => {
        // Obtener el token para despues verificarlo
        const { tokens } = await authCient.getToken({
            code: googleCode,
            redirect_uri: process.env.GOOGLE_CALLBACK_URL
        });
        console.log({ tokens });

        // Verificar que el token si sea de la misma app
        const ticket = await authCient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_APP_ID
        });

        const userData = ticket.getPayload();
        console.log({ userData });
        return userData;
    };
};