import Post from "../models/post.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import plimit from "p-limit";

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
export {
    createPost
}