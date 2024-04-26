import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js"
import userRoutes from "./routes/users.js";
import postRouter from "./routes/post.routes.js";

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(express.json({limit: process.env.LIMIT}));
app.use(express.urlencoded({extended: true, limit: process.env.LIMIT}))
app.use(express.static("public"))
app.use(cookieParser());

/* ROUTES */
app.use("/auth", userRouter);
app.use("/users", userRoutes);
app.use("/posts", postRouter);

export default app;