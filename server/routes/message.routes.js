import express from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { sendMessage, allMessages } from "../controllers/message.controller.js";
const Router = express.Router();

Router.route("/").post(verifyJWT, sendMessage);

Router.route("/:chatId").get(verifyJWT, allMessages);

export default Router;

// Router.route('/')
// .post(addMessage);

// Router.route('/:chatId')
// .get(getMessages);
