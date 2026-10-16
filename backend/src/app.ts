import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import resumeRoutes from "./routes/resumeRoutes";
import jobMatchRoutes from "./routes/jobMatchRoutes";
import interviewRoutes from "./routes/interviewRoutes";

const app = express();

const allowedOrigins = new Set(
  [
    "https://ai-career-assistant12.netlify.app",
    "http://localhost:5173",
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
  ].filter((origin): origin is string => Boolean(origin))
);

app.use(cors((req, callback) => {
  const origin = req.header("Origin");
  const host = req.header("X-Forwarded-Host") || req.header("Host");
  let isSameOrigin = false;

  if (origin && host) {
    try {
      isSameOrigin = new URL(origin).host === host;
    } catch {
      isSameOrigin = false;
    }
  }

  // The frontend and API are served from the same Netlify site, so any
  // same-origin request (production, deploy previews, custom domains) is allowed.
  callback(null, {
    origin: !origin || isSameOrigin || allowedOrigins.has(origin),
    credentials: true,
  });
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/job-matches", jobMatchRoutes);
app.use("/api/interviews", interviewRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ message: "ai-career-assistant api is running" });
});

app.get("/", (_req, res) => {
  res.json({ message: "ai-career-assistant api is running" });
});

export default app;
