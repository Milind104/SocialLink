import plimit from "p-limit";
import Post from "../models/post.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Like from "../models/like.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
/*
createdBy,
text,
likeCount,
repostCount,
commentCount,
image,
video
*/
const limit = plimit(20);
async function helper(images){
    const imagesToUpload = images.map((image)=> {
        return limit(async ()=> {
            const result = await uploadOnCloudinary(image.path);
            return result;
        })
    })
    return await Promise.all(imagesToUpload);
}

const createPost = asyncHandler( async(req, res) =>{
    const {text} = req.body;
    
    
    // console.log(req.files?.video[0]?.path);
    const imageLocalPath = req.files?.image[0]?.path;
    const videoLocalPath = req.files?.video?.path;

    if([
        text, imageLocalPath, videoLocalPath
    ].forEach((ele)=>{ele == ""})){
        throw new ApiError(400, "Aleast one field is required");
    }

    var imageUrls = "", videoUrl = "";
    // upload on cloudinary
    if(imageLocalPath){
        const images = await helper(req.files?.image);  // this ans array of object
        imageUrls = images.map((ele) => ele.url);
    }
    if(videoLocalPath){
        videoUrl = await uploadOnCloudinary(videoLocalPath);  
    }

    // create new Post
    const post = await Post.create({
        createdBy: req.user._id,
        image: imageUrls,
        video: videoUrl,
    })

    // post not created throw new error
    if(!post){
        throw new ApiError(500, "Something went wrong while creating Post");
    }

    return res.status(200).json(
        new ApiResponse(200, post, "Post created Successfully")
    );
})

const likePost = asyncHandler( async(req, res) =>{
    const id = req.params.id;
    if(!id){
        throw new ApiError(400, "request is not valid");
    }
    console.log(id);
    // check if post exist with given id
    const post = await Post.findById(id);
    console.log(post);
    if(!post){
        throw new ApiError(401, "Post is not availble or may be removed!!!");
    }

    // create like object
    const like = await Like.create({
        likedBy: req.user._id,
        postLiked: id
    });

    // check if it's done
    if(!like){
        throw new ApiError(500, "Something went wrong at server side!!!");
    }

    return res.status(200)
    .json(new ApiResponse(200, like, "Liked Successfully !!!"));
})

const getMyPosts = asyncHandler( async(req, res) =>{
    const id = req.params.userId;
    const loggedInUser = req.user._id;

    // loggedInUser.toString();
    // console.log(id, loggedInUser.toString() );
    if(!id){
        throw new ApiError(401, "request is not valid!!!");
    }

    // check if user exist
    const user = await User.findById(id);
    // console.log(user);
    if(!user){
        throw new ApiError(404, "Login or register first!!!");
    }

    // check params id and token id is same
    // console.log(id, loggedInUser)
    if(id !== loggedInUser.toString()){
        throw new ApiError(405, "Authenticate user first!!!");
    }

    // find all the post with given id
    const posts = await Post.find({createdBy: id});
    // console.log(posts);
    if(!posts){
        throw new ApiError(500, "Something went while fatching your posts!!!");
    }

    return res.status(200)
    .json(new ApiResponse(200, posts, "Successfully fetched all your posts"));

})

const deletePost = asyncHandler( async(req, res) =>{
    const id = req.params.id;
    const userId = req.user._id;

    if(!id){
        throw new ApiError(401, "request is not valid!!!");
    }

    // check if post exist
    const post = await Post.findById(id);
    if(!post){
        throw new ApiError(404, "Post does not exists ");
    }

    
    // check if user is same as the owner of post
    // console.log(post.createdBy.toString(), userId);
    if(post.createdBy.toString() !== userId.toString()){
        throw new ApiError(400, "You are not authorized to do this action!!!");
    }

    // remove the post findby id
    await Post.findByIdAndDelete(id);

    return res.status(200)
    .json(new ApiResponse(200, {}, "Post deleted Successfully!!!!!"));
})

const getFeedPosts = asyncHandler( async(req, res) =>{

})

const updatePost = asyncHandler( async(req, res) =>{

})

export {
    createPost,
    deletePost,
    getMyPosts,
    getFeedPosts,
    updatePost,
    likePost
}