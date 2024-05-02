import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
// import userRoutes from "./routes/users.js";
import postRouter from "./routes/post.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import helmet from "helmet";
import companyRouter from "./routes/company.routes.js";
import JobRouter from "./routes/job.routes.js";

const app = express();
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", "*"];

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: process.env.LIMIT }));
app.use(express.urlencoded({ extended: true, limit: process.env.LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

/* ROUTES */
app.use("/auth", userRouter);
// app.use("/users", userRoutes);
app.use("/posts", postRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);
app.use("/company", companyRouter);
app.use("/job", JobRouter);
export default app;