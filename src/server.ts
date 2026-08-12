import express from "express";
import { pool } from "./db";
import authRoute from "./routes/auth"
import studentRoute from "./routes/students"
import courseRoute from "./routes/courses"
import assignmentRouter from "./routes/assignments"

const PORT = Number(process.env.PORT) || 3000

const app = express();

app.use(express.json());

app.use('/api/auth', authRoute);

app.use('/api/courses', courseRoute);

app.use('/api/students', studentRoute)

app.use('/api/assignments', assignmentRouter)

app.get("/status", (req, res) => {
    res.json({
        success: true,
        message: "Server is running"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on http://localhost:3000");
});
