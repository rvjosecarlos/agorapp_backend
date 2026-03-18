import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { corsOptions } from "./config/cors.options.config.js";
import routerAuth from "./routes/auth.routes.js";
import routerPost from "./routes/post.routes.js";
import routerUsuario from "./routes/usuario.routes.js";
import routerAgente from "./routes/agente.routes.js";
import routerEstadoPost from "./routes/estados.post.routes.js";
import routerComentarios from "./routes/comentarios.routes.js";
import routerLikes from "./routes/likes.route.js";
import routerNotificacion  from "./routes/notificacion.routes.js";
import { initDB } from "./db/index.js";

dotenv.config();

initDB();

const app = express();

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", routerAuth);
app.use("/api", routerPost);
app.use("/api", routerUsuario);
app.use("/api", routerAgente);
app.use("/api", routerEstadoPost);
app.use("/api", routerComentarios);
app.use("/api", routerLikes);
app.use("/api", routerNotificacion);

export default app;