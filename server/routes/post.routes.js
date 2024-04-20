import express from "express";
import {
  createPost,
  deletePost,
  getMyPosts,
  getFeedPosts,
  updatePost,
  likePost,
} from "../controllers/post.controller.js";
import upload from "../middleware/multer.js";
import verifyJWT from "../middleware/auth.middleware.js";

const Router = express();

/* CREATE */
Router.route("/create").post(
  verifyJWT,
  upload.fields([
    {
      name: "image",
      mxCount: 20,
    },
    {
      name: "video",
      mxCount: 1,
    },
  ]),
  createPost
);

/*DELETE*/
Router.route("/:id").delete(verifyJWT, deletePost);

/* READ */
Router.route("/:userId/posts").get(verifyJWT, getMyPosts);
Router.route("/").get(verifyJWT, getFeedPosts);

/* UPDATE */
Router.route("/:id").patch(
  verifyJWT,
  upload.fields([
    {
      name: "image",
      mxCount: 20,
    },
    {
      name: "video",
      mxCount: 1,
    },
  ]),
  updatePost
);

/*Actions on Post*/

/*LIKE */
Router.route("/:id/like").post(verifyJWT, likePost);

export default Router;
