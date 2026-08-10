import express from "express";
import { pool } from "./db";
import authRoute from "./routes/auth"
import studentRoute from "./routes/students"


const app = express();

app.use(express.json());

app.use('/api/auth', authRoute);

app.use('/api/students', studentRoute)

app.get("/status", (req, res) => {
    res.json({
        success: true,
        message: "Server is running"
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
