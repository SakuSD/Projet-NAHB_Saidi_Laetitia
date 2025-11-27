import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

// load explicit .env from project root (Back-end/.env)
const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });
console.log("[config/db] loading env from:", envPath, "DB_USER=", process.env.DB_USER ? '(set)' : '(missing)');

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
