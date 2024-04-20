import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    postLiked: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
});

const Like = mongoose.model("Like", likeSchema);

export default Like;