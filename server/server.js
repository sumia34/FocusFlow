import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dns from "node:dns";

import { connectDB } from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import registerRoutes from "./routes/registerRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("Please set a JWT_SECRET of at least 32 characters in server/.env");
  process.exit(1);
}

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "FocusFlow backend is running!",
  });
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/auth", registerRoutes);
app.use("/api", taskRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found." });
});

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`FocusFlow API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start FocusFlow:", error.message);
    process.exit(1);
  }
}

startServer();