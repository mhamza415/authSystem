import colors from "colors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import morgan from "morgan";
import session from "express-session";

const app = express();
dotenv.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Replace with your own secret key
    resave: false,
    saveUninitialized: false,
    // Additional configuration options if needed
  })
);

app.use(express.json());

connectDB();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

export default app;
