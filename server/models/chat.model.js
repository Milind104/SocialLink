import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    chatName: {
        type: String,
        trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    lastestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }
},{timestamps: true});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;