import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import userRoutes from "./routes/users.js";
import postRouter from "./routes/post.routes.js";
import helmet from "helmet";

// const express = require("express");
const app = express();
//const PORT = process.env.PORT || 3000;
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// Middleware to set CORS headers
app.use((req, res, next) => {
  // Set CORS headers to allow all origins
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next(); // Continue to the next middleware
});

// Your API routes and other middleware can go here
app.get("/", (req, res) => {
  res.send("Hello CORS!");
});

// // Start the server
// app.listen(3001, () => {
//   console.log("server is runninnjrjgheg");
// });

app.use(express.json({ limit: process.env.LIMIT }));
app.use(express.urlencoded({ extended: true, limit: process.env.LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

/* ROUTES */
app.use("/auth", userRouter);
app.use("/users", userRoutes);
app.use("/posts", postRouter);

export default app;
