import express, { request } from "express";
import upload from "../middleware/multer.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import {
  connectToUser,
  UserRequests,
  acceptUserRequest,
  getAllConnections,
  removeConnection,
  getImageUrl,
  allUsers,
  requestStatus,
  getUserProfile,
} from "../controllers/user.controller.js";
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
Router.route("/login").post(loginUser);

// refresh expired token
Router.route("/refresh-accesstoken").post(refreshAccessToken);

/* protected route */
// user profile
Router.route("/profile/:id").get(getUserProfile);
//logout
Router.route("/logout").post(verifyJWT, logoutUser);

// get image url
Router.route("/image/:userId").get(verifyJWT, getImageUrl);

// connection request
Router.route("/sendreq/:id").post(verifyJWT, connectToUser);

// requests
Router.route("/pendingreq").post(verifyJWT, UserRequests);

// accept request
Router.route("/accept/:requestId").post(verifyJWT, acceptUserRequest);

// get all connections
Router.route("/connections/:userId").get(getAllConnections);

// remove connection
Router.route("/:id/:connectionId").delete(verifyJWT, removeConnection);

// find user by name
Router.route("/").get(verifyJWT, allUsers);

// request status
Router.route("/request/:userId").post(verifyJWT, requestStatus);
/*Message routes*/

export default Router;
