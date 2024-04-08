import express from "express";
import upload from "../middleware/multer.js";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
 
const Router = express();
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

Router.route("/login")
.post(loginUser);

// protected route
Router.route("/logout")
.post(verifyJWT, logoutUser);

Router.route("/refresh-accesstoken")
.post(refreshAccessToken);
export default Router;
