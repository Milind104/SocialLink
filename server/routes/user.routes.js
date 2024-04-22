import express, { request } from "express";
import upload from "../middleware/multer.js";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/auth.controller.js";
import { connectToUser, UserRequests, acceptUserRequest, getAllConnections, removeConnection } from "../controllers/user.controller.js";
import { createChat, sendMessage } from "../controllers/chat.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
 
const Router = express();
/* AUTH routes */

// register
Router.route("/register").post(
  upload.fields([
    {
      name: "profileImg",
      mxCount: 1,
    },
    {
      name: "coverImg",
      mxCount: 1,
    },
  ]),
  registerUser
);

// login
Router.route("/login")
.post(loginUser);

// refresh expired token
Router.route("/refresh-accesstoken")
.post(refreshAccessToken);


/* protected route */

//logout 
Router.route("/logout")
.post(verifyJWT, logoutUser);

// connection request
Router.route("/connect/:id")
.post(verifyJWT, connectToUser);

// requests 
Router.route("/requests/:id")
.get(verifyJWT, UserRequests);

// accept request
Router.route("/accept/:requestId")
.patch(verifyJWT, acceptUserRequest);

// get all connections
Router.route("/connections/:userId")
.get(verifyJWT, getAllConnections);

// remove connection
Router.route("/:id/:connectionId")
.delete(verifyJWT, removeConnection);

/*Message routes*/

// create chat
Router.route("/:id/:friendId")
.post(verifyJWT, createChat);

// send message 
Router.route("/chat/:id/:chatId")
.post(verifyJWT, 
  upload.fields([
    {
      name: "media",
      mxCount: 1
    }
  ]), 
  sendMessage);

export default Router;
