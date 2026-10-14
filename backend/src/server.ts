import "dotenv/config";
import app from "./app";
import connectDB from "./config/db";

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
