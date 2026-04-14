import app from "./server.js";

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
    console.log(`Servidor en linea: ${port}`);
});