import "dotenv/config";
import { readFile } from "fs/promises";
import { pool } from "../src/db";

async function setupDatabase() {
    try {
        const schema = await readFile("sql/schema.sql", "utf-8");

        await pool.query(schema);

        console.log("Database schema created successfully");
    } catch (error) {
        console.error("Failed to create database schema:", error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

setupDatabase();