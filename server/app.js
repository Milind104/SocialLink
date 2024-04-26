import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import userRoutes from "./routes/users.js";
import postRouter from "./routes/post.routes.js";
import helmet from "helmet";

const app = express();
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", "*"];

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the request origin is in the allowed origins list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow sending cookies and authorization headers
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specified HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specified headers
};
app.use(cors(corsOptions));
app.options("http://localhost:3000", cors(corsOptions));

app.use(express.json({ limit: process.env.LIMIT }));
app.use(express.urlencoded({ extended: true, limit: process.env.LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

/* ROUTES */
app.use("/auth", userRouter);
app.use("/users", userRoutes);
app.use("/posts", postRouter);

export default app;
