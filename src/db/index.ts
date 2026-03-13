import process from "node:process";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

let pool: Pool;

export const initDB = async () => {
    try{
        pool = new Pool({ 
            connectionString: process.env.DATABASE_URL,
            max: 40 
        });
    }
    catch(error){
        if( error instanceof Error ){
            console.error(`Error al conectarse a la base de datos - ${error.message}`);
        }
        else{
            console.error(JSON.stringify(error));
        };
        process.exit(1);
    };
};

export const getPoolDB = () => {
    if(!pool){
        throw new Error("Erro al cargar el pool de conexiones");
    }
    return pool;
};