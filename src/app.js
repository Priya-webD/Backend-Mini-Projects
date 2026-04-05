import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.get("/", (req,res) => {
    res.send("Welcome to udemy");
});

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

//cookie parser middleware
app.use(cookieParser());


app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ["Authorization", "content-Type"],
}));


 //import routers 
import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routers.js";
//use routers 
app.use("/api/v1/healthcheck", healthCheckRouter); // Use the health check router for the specified path
app.use("/api/v1/auth", authRouter); // Use the auth router for the specified path


export default app;