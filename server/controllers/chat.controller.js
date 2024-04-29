import Chat from '../models/chat.model.js';
import User from "../models/user.model.js"

const accessChat = async(req,res)=>{
    const {userId} = req.body;

    if(!userId){
        console.log("UserId param not sent with request");
    }
    var isChat = await Chat.find({
        isGroupChat: false, 
        $and:[
            {users : {$elemMatch:{$eq: req.user._id}}},
            {users: {$elemMatch : {$eq: userId}}},
        ]
    }).populate("users","-password").populate("latestMessage");

    isChat =  await User.populate(isChat,{
        path : "latestMessage.sender",
        select : "name pic email",
    })

    if(isChat.length > 0){
        res.send(isChat[0]);
    }
    else{
        var chatData = {
            ChatName: "sender",
            isGroupChat: false,
            users:[req.user._id, userId]
        };

        try {
            const created = await Chat.create(chatData);

            const FullChat = await Chat.findOne({_id:created._id}).populate("users","-password");
            res.status(200).send(FullChat);
        } catch (error) {
            res.status(400);
        }
    }
}
const fetchChats = async (req, res) => {
    try {
      Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
          res.status(200).send(results);
        });
    } catch (error) {
      res.status(400);
    }
};

const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }
  
    var users = JSON.parse(req.body.users);
  
    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
  
    users.push(req.user);
  
    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });
  
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
};
  const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;
  
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!updatedChat) {
      res.status(404);
    } else {
      res.json(updatedChat);
    }
};
const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;
  
    // check if the requester is admin
  
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
      res.status(404);
    } else {
      res.json(removed);
    }
  };
  
const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;
  
    // check if the requester is admin
  
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!added) {
      res.status(404);
    //   throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }
};
export {accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup};




// const ChatModel = require('../Models/chatModel');

// const createChat = async(req,res)=>{
//     const newChat = new ChatModel({
//         members : [req.body.senderId, req.body.receiverId],
//     });
    
//     try {
//         const result = await newChat.save();
//         res.status(200).json(result);
//     } catch (error) {
//         res.status(500).json("error");
//     }
// }

// const userChats = async(req,res)=>{
//     try {
//         const chat = await ChatModel.find({
//             members : {$in : [req.params.userId]}
//         })
//         res.status(200).json(chat);

//     } catch (error) {
//         res.status(500).json("error");
//     }
// }

// const findChat = async(req,res)=>{
//     try {
//         const chat = await ChatModel.findOne({
//             members : {$all: [req.params.firstId, req.params.secondId]}
//         });
//         res.status(200).json(chat);
//         m
//     } catch (error) {
//         res.status(500).json("Error");
//     }
// }

// module.exports = {findChat,createChat,userChats};