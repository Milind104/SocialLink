const express = require('express');
const protect = require('../middleware/auth');
const { sendMessage, allMessages} = require('../controller/messageController');
const Router = express.Router();

Router.route('/')
.post(protect,sendMessage);

Router.route('/:chatId')
.get(protect, allMessages);
module.exports = Router;
























// Router.route('/')
// .post(addMessage);

// Router.route('/:chatId')
// .get(getMessages);