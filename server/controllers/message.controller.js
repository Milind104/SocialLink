import Message from "../Models/messageModel";
import User from "../Models/userModel";
import Chat from "../Models/chatModel";

const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
  }
};


const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  // console.log("message ", content);
  try {
    var message = await Message.create(newMessage);
    
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
  }
};

export { allMessages, 
        sendMessage };





























// const addMessage = async(req,res)=>{
//     const {chatId, senderId, text} = req.body;
//     const message = new MessageModel({
//         chatId,
//         senderId,
//         text
//     });
//     try {
//         const result = await message.save();
//         res.status(200).json(result);

//     } catch (error) {
//         res.status(500).json("Error");
//     }
// }

// const getMessages = async(req,res)=>{
//     const {chatId} = req.params;
//     try {
//         const result = await MessageModel.find({chatId});
//         res.status(200).json(result);
//     } catch (error) {
//         res.status(500).json("Error");
//     }
// }