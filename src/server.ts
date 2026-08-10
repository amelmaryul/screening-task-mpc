import express from "express";

const app = express();

app.use(express.json());

app.get("/status", (req, res) => {
    res.json({
        success: true,
        message: "Server is running"
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
