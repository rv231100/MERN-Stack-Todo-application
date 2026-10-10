// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => res.send('Hello World!'))
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// ======================================
// import connectDB from "./config/db.js";
import express from "express";
const app = express();
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.SERVER_BASE_URL || 5000;
// const CLIENT_BASE_URL = process.env.CLIENT_URL;

app.use(express.static("./dist"));
connectDB();
//Middlewares
app.use(morgan("dev")); // Predefined colorful format for development
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

//---actual routes
//authRoute
app.use("/api/auth", authRoutes);
//taskRoute
app.use("/api/tasks", taskRoutes);

//Test Route
app.get("/", (req, res) => res.send("Todo API is Running..!"));

//wild card route always at the end of all routes.
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
