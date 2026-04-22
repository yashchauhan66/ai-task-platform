import express from "express"
import connectDB from "./src/config/db.js"
import authRoutes from "./src/routes/authRoutes.js"
import helmet from "helmet"
import Limiter from "express-rate-limit"
import cors from "cors"
import taskRoutes from "./src/routes/taskRoutes.js"
const app = express();

app.use(cors({
    origin: "http://localhost:3000"
}))

app.use(express.json())

app.use(helmet())


app.get("/health", (req, res) => {
    
    res.send("Health is ok")
})

app.use("/api/auth", Limiter({ windowMs: 15 * 60 * 1000, max: 20 }), authRoutes)
app.use("/api/task", Limiter({ windowMs: 15 * 60 * 1000, max: 200 }), taskRoutes)

connectDB();

app.listen(5000, () => {

    console.log("server is running on port 5000")

}).on('error', (err) => {

    if (err.code === 'EADDRINUSE') {

        console.error('Port 5000 is already in use. Please kill the existing process or use a different port.');

        process.exit(1);
    } else {

        console.error('Server error:', err);
    }
});

process.on("unhandledRejection", (err) => {

    console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {

    console.error("Uncaught Exception:", err);
});