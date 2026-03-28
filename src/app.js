import express from "express";
import cors from "cors";

const app = express();

app.get("/", (req,res) => {
    res.send("Welcome to udemy");
});

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

app.use(cors({
    origion: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ["Authorization", "content-Type"],
}),
);


 //import routers 
import healthCheckRouter from "./routes/healthcheck.routes.js";

//use routers 
app.use("/api/v1/healthcheck", healthCheckRouter); // Use the health check router for the specified path


export default app;