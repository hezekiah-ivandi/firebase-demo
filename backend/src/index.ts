import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import { AppDataSource } from "./config/postgres-db";
import itemRoutes from "./routes/item.route";
import authRoutes from "./routes/auth.route";
import cors from "cors";
const app = express();
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT || 4001;

app.use(
  cors({
    origin: process.env.FRONTEND_URI || "http://localhost:3000",
  })
);
//Firebase route
app.use(itemRoutes);
//Postgres + Firebase auth
app.use(authRoutes);

// Connect to PostgreSQL
AppDataSource.initialize()
  .then(() => {
    console.log("Connected to PostgreSQL");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to PostgreSQL:", error);
  });
