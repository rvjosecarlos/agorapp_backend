import { readdirSync, readFileSync } from "node:fs";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

(async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        database: "agorapp_core_db"
    });
    
    try{

        const migraciones = readdirSync(`${process.cwd()}/src/db/migrations/`, "utf-8").sort();

        await client.connect();
        await client.query("BEGIN");
        const result = await client.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';");

        if( result.rowCount === 0 ){
            console.log("Creando la BD...");
            const sql = readFileSync(`${process.cwd()}/src/db/migrations/${migraciones[0]}`, "utf-8");
            const result = await client.query(sql);
            await client.query("INSERT INTO migraciones (nombre) VALUES($1)", [migraciones[0]]);
            console.log("Migracion inicial ejecutada", result);
        }
        else if( migraciones.length > 1 ){
            const results = await client.query("SELECT nombre FROM migraciones");
            const migracionesEjecutadas = results.rows.map( m => m.nombre );
            const migracionesSet = new Set(migracionesEjecutadas);
            const migracionesPendientes = migraciones.filter( migracion => !migracionesSet.has(migracion) );
            for( let mPendiente of migracionesPendientes ){
                const sql = readFileSync(`${process.cwd()}/src/db/migrations/${mPendiente}`, "utf-8");
                await client.query(sql);
                await client.query("INSERT INTO migraciones (nombre) VALUES($1)", [mPendiente]);
                console.log(`Migracion ejecutada: ${mPendiente}`);
            };
            console.log(`Total de migraciones ejecutadas: ${migracionesPendientes.length}`);
        };

        await client.query("COMMIT");
        console.log("Migracion completada");
    }
    catch(error){
        if( client ) client.query("ROLLBACK");
        console.log("Error:", error);
        process.exit(1);
    }
    finally{
        if( client ) await client.end();
    }
})();