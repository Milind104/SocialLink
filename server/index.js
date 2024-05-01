import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import Chat from "./models/chat.model.js";
import { Server } from "socket.io";
/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ROUTES WITH FILES */
// app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database is Connected Successfully!!!!");
    const server = app.listen(PORT, () =>
      console.log(`Server Port: ${PORT}........`)
    );

    const io = new Server(server, {
      pingTimeOut: 600000,
      cors: {
        origin: "http://localhost:3000",
      },
    });

    io.on("connection", (socket) => {
      // console.log("Conncted to socket.io", socket);

      // set up (user open chat app )
      socket.on("setup", (userData) => {
        console.log(userData, "This is what we got");
        socket.join(userData._id);
        socket.emit("Connected");
      });

      // open particular chat
      socket.on("join chat", (room) => {
        // console.log("room id ", room);
        socket.join(room);
      });

      socket.on("new message", (newMessageRecived) => {
        var chat = newMessageRecived.chat;
        // console.log("msg");
        if (!chat.users) return console.log("chat users not defined");

        chat.users.forEach((user) => {
          if (user._id == newMessageRecived.sender._id) return;
          socket.in(user._id).emit("message recieved", newMessageRecived);
        });
      });
    });
  })
  .catch((error) => console.log(`${error} did not connect`));
