import { Pool } from "pg";
import dotenv from "dotenv"

dotenv.config();

const pool = new Pool({
    host: process.env.PG_HOST || "localhost",
    port: Number(process.env.PG_PORT) || 5432,
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASSWORD || "",
    database: process.env.PG_DB_NAME || "RecipeCollection"
});

async function createPostgresConnection(){
    try {
        const client = await pool.connect();
        console.log("Connected to PostgreSQL");
        client.release();
    } catch (error) {
        console.error("Error connecting to PostgreSQL", error);
    }
}

export default createPostgresConnection;
export {pool}