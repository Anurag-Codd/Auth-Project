import { connectDB } from "./database/mongoDB.js";
import connectRedis from "./database/redis.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  console.log("Production mode: Serving static files");

  app.use(
    express.static(path.join(__dirname, "/frontend/dist"), {
      setHeaders: (res, path, stat) => {
        console.log(`Serving: ${path}`);
      },
    })
  );

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(path.join(__dirname, "frontend", "dist", "index.html")),
      (err) => {
        if (err) {
          console.error("Error serving index.html:", err);
          res.status(500).send(err);
        }
      }
    );
  });
}

app.listen(PORT, async () => {
  try {
    await connectDB();
    await connectRedis();
    console.log(`Server is running on port: ${PORT}`);
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
});
