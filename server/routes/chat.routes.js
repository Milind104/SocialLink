const express = require('express');

// const {createChat,userChats,findChat} = require('../controller/chatController.js');
const {accessChat,fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup} = require('../controller/chatController');
const protect = require('../middleware/auth.js');
const Router = express.Router();

Router.route("/")
.post(protect,accessChat)
.get(protect, fetchChats);

Router.route("/group")
.post(protect,createGroupChat);

Router.route("/rename")
.put(protect, renameGroup);

Router.route("/groupremove")
.put(protect, removeFromGroup);

Router.route("/groupadd")
.put(protect, addToGroup);

module.exports = Router;



// Router.route('/')
// .post(createChat);

// Router.route('/:userId')
// .get(userChats);

// Router.route('/find/:firstId/:secondId')
// .get(findChat);