import dotenv from "dotenv";
dotenv.config({path: "../.env"});
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import userRouter from "./routes/user.routes.js"
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import app from "./app.js";
/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



/* ROUTES WITH FILES */
// app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", userRouter);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));