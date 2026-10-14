import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import resumeRoutes from "./routes/resumeRoutes";
import jobMatchRoutes from "./routes/jobMatchRoutes";
import interviewRoutes from "./routes/interviewRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/job-matches", jobMatchRoutes);
app.use("/api/interviews", interviewRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "ai-career-assistant api is running",
  });
});

const PORT = Number(process.env.PORT) || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error: unknown) => {
    console.error("Failed to start server because MongoDB connection was not established:", error);
    process.exit(1);
  });

