import express from "express";
// const {createChat,userChats,findChat} = require('../controller/chatController.js');
import {accessChat,fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup} from "../controllers/chat.controller";
import verifyJWT  from "../middleware/auth.middleware";
const Router = express.Router();

Router.route("/")
.post(verifyJWT,accessChat)
.get(verifyJWT, fetchChats);

Router.route("/group")
.post(verifyJWT,createGroupChat);

Router.route("/rename")
.put(verifyJWT, renameGroup);

Router.route("/groupremove")
.put(verifyJWT, removeFromGroup);

Router.route("/groupadd")
.put(verifyJWT, addToGroup);

module.exports = Router;



// Router.route('/')
// .post(createChat);

// Router.route('/:userId')
// .get(userChats);

// Router.route('/find/:firstId/:secondId')
// .get(findChat);