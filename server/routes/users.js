import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import  verifyJWT  from "../middleware/auth.middleware.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyJWT, getUser);
router.get("/:id/friends", verifyJWT, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyJWT, addRemoveFriend);

export default router;