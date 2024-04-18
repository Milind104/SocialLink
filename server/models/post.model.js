import mongoose, { Types } from "mongoose";

const postSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    text: {
        type: String
    },
    likeCount: {
        type: Number,
        default: 0
    },
    repostCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    },
    image: [
        {
            type: String   //cloudinary url
        }
    ],
    video: {
        type: String   // cloudinary url
    }
},{ timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;