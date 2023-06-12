import colors from "colors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import morgan from "morgan";

const app = express();

app.use(express.json());

dotenv.config();
connectDB();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

export default app;
