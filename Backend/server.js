import express from "express"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import helmet from "helmet"
import Limiter from "express-rate-limit"
import cors from "cors"
import taskRoutes from "./routes/taskRoutes.js"
const app= express();
app.use(cors())
app.use(express.json())
app.use(helmet())

// app.use(Limiter({
//     windowMs:15*60*1000,
//     max:1000,
//     message:"Too many requests from this IP, please try again later"
// }))

app.get("/Health",(req, res)=>{
    res.send("Health is ok")
})
app.use("/api/auth",authRoutes)
app.use("/api/task", taskRoutes)
connectDB();
app.listen(5000, ()=>{
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