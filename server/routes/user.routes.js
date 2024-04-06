import express from "express";
import upload from "../middleware/multer.js";
import { registerUser, loginUser } from "../controllers/user.controller.js";

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

Router.route("/login").post(loginUser);

export default Router;
