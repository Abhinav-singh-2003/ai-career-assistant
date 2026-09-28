import express from "express";//1,6,9,14,19
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import resumeRoutes from "./routes/resumeRoutes";

dotenv.config();//secrets are loaded from .env file into process.env to use them in the application.

const app= express();//express instance is created to handle incoming requests and send responses.

app.use(cors());//cors middleware is used to enable cross-origin resource sharing, allowing the server to accept requests from different origins.
app.use(express.json());//express.json() middleware is used to parse incoming JSON payloads in the request body, making it accessible via req.body.

connectDB();//connectDB() function is called to establish a connection to the MongoDB database using the connection string specified in the environment variables.

app.use("/api/auth",authRoutes);//authRoutes are mounted on the /api/auth path, allowing the server to handle authentication-related routes defined in authRoutes.
app.use("/api/users", userRoutes);//userRoutes are mounted on the /api/users path, allowing the server to handle user-related routes defined in userRoutes.)
app.use("/api/resumes", resumeRoutes);//creating and fetching resume only for logged in user .
app.get("/", (req,res)=>{
    res.json({
        message: "ai-career-assistant api is running"
    });
});

const PORT=process.env.PORT ||5000;

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
});


