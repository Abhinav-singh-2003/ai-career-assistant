"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express")); //1,6,9,14,19,31,36
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const resumeRoutes_1 = __importDefault(require("./routes/resumeRoutes"));
const jobMatchRoutes_1 = __importDefault(require("./routes/jobMatchRoutes"));
const interviewRoutes_1 = __importDefault(require("./routes/interviewRoutes"));
const app = (0, express_1.default)(); //express instance is created to handle incoming requests and send responses.
app.use((0, cors_1.default)()); //cors middleware is used to enable cross-origin resource sharing, allowing the server to accept requests from different origins.
app.use(express_1.default.json()); //express.json() middleware is used to parse incoming JSON payloads in the request body, making it accessible via req.body.
(0, db_1.default)(); //connectDB() function is called to establish a connection to the MongoDB database using the connection string specified in the environment variables.
app.use("/api/auth", authRoutes_1.default); //authRoutes are mounted on the /api/auth path, allowing the server to handle authentication-related routes defined in authRoutes.
app.use("/api/users", userRoutes_1.default); //userRoutes are mounted on the /api/users path, allowing the server to handle user-related routes defined in userRoutes.)
app.use("/api/resumes", resumeRoutes_1.default); //creating and fetching resume only for logged in user .
app.use("/api/job-matches", jobMatchRoutes_1.default); //jobMatchRoutes are mounted on the /api/job-matches path, allowing the server to handle job matching-related routes defined in jobMatchRoutes.
app.use("/api/interviews", interviewRoutes_1.default); //interviewRoutes are mounted on the /api/interviews path, allowing the server to handle interview-related routes defined in interviewRoutes.   
app.get("/", (req, res) => {
    res.json({
        message: "ai-career-assistant api is running"
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map