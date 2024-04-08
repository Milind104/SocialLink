import express from "express";
import { getFeedPosts, getUserPosts, likePost, createComment, updatePost,
    deletePost, } from "../controllers/posts.js";
import  verifyJWT  from "../middleware/auth.middleware.js";

const router = express.Router();

/* READ */
router.get("/", verifyJWT, getFeedPosts);
router.get("/:userId/posts", verifyJWT, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyJWT, likePost);
router.patch("/:id", verifyJWT, updatePost);

/* DELETE */
router.delete("/:id", verifyJWT, deletePost);

/* CREATE */
router.post("/create-comment", verifyJWT, createComment);

export default router;