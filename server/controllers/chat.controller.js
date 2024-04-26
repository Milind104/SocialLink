import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js"
import Connection from "../models/connection.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

/*chat Actions*/

// create chat
const createChat = asyncHandler( async(req, res) =>{
    const id = req.params.id;
    const loggedInUser = req.user._id;
    const friendId = req.params.friendId;

    console.log(id, loggedInUser.toString(), friendId);
    if(id !== loggedInUser.toString()){
        throw new ApiError(401, "Authenticate first");
    }

    // check if both are friends or not 
    const isFriends = await Connection.findOne({
        $or: [
            {
                $and: [
                    {sender: id},
                    {receiver: friendId}
                ]
            },
            {
                $and: [
                    {sender: friendId},
                    {receiver: id}
                ]
            }
        ]
    });
    
    // console.log(isFriends);

    if(!isFriends){
        throw new ApiError(404, "Send connection request");
    }

    const chat = await Chat.create({
        members: [friendId, id]
    })

    if(!chat){
        throw new ApiError(500, "Something went wrong while creating chat");
    }

    return res.status(200)
    .json(new ApiResponse(200, chat, "Chat is created successfully"));
})

// send message
const sendMessage = asyncHandler( async(req, res) =>{
    const id = req.params.id;
    const loggedInUser = req.user._id;
    const chatId = req.params.chatId;

    const {text} = req.body; 
    if(id !== loggedInUser.toString()){
        throw new ApiError(401, "Authenticate first");
    }

    // find chat with given id
    const chat = await Chat.findById(chatId);
    if(!chat){
        throw new ApiError(404, "Chat is not created!!!!");
    }

    const mediaLocalPath = req.files?.media[0]?.path;

    if( !mediaLocalPath && !text ){
        throw new ApiError(404, "Can't send empty message");
    }
    const media = (mediaLocalPath !== "")?await uploadOnCloudinary(mediaLocalPath):"";

    console.log(media, "............");

    console.log(id, chatId, text,)
    const message = await Message.create({
        sender: id,
        chatId,
        text,
        content: media.url
    });

    console.log(message);

    if(!message){
        throw new ApiError(500, "Something went wrong while creating message");
    }

    return res.status(200)
    .json(new ApiResponse(200, message, "Message sent Successfully"));
});

const getAllmessges = asyncHandler( async(req, res) =>{
    const { chatId } = req.params.chatId;

    const messages = await Message.findById(chatId);

    if(!messages){
        throw new ApiError(404, "Messages are not fetched successfully...");
    }

    return res.status(200).json(new ApiResponse(200, messages, "Messages fetched!!!"));
});

export {
    createChat,
    sendMessage,
    getAllmessges
}