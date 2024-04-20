import express from "express";
import upload from "../middleware/multer.js";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/auth.controller.js";
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

export default Router;
