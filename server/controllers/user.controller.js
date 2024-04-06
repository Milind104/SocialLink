import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import uploadOnCloudinary from "../utils/cloudinary.js";
import  ApiResponse from "../utils/ApiResponse.js";

const generateAccessTokenAndrefreshToken = async(id) =>{
    try {
        const user = await User.find({_id: id});
        
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        user.save().donotvalidate()
        
        return accessToken;
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating accesstoken and refresh token!!!");
    }
}
const registerUser = asyncHandler(async (req, res) => {
    // destructure all the fields
    const {email, password, firstName, lastName, location, occupation} = req.body;
    
    // if any of required fields are empty
    if([
        email, password, firstName, lastName, location, occupation
    ].some((field)=>{ field?.trim() === ""})
    ){
        throw new ApiError(400, "All fields are required!!!");
    }

    // email already registered
    const userExist = await User.findOne({email});
    if(userExist){
        throw new ApiError(409, "Email is already registered!!!");
    }

    console.log(req.files);
    // upload images on cloudinary from local storage
    const profileImgLocalPath = req.files?.profileImg[0]?.path;
    const coverImgLocalPath = req.files?.coverImg[0]?.path;
    const profileImg = await uploadOnCloudinary(profileImgLocalPath);
    const coverImg = await uploadOnCloudinary(coverImgLocalPath);

    console.log(profileImgLocalPath, profileImg);
    console.log(coverImgLocalPath, coverImg);
    
    // create a new user object 
    const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        profileImg: profileImg?.url || "",
        coverImg: coverImg?.url || "",
        location,
        occupation
    });
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while creating User");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );

});
const loginUser = asyncHandler(async (req, res) => {
    // destruture request body
    const { email, password } = req.body;

    // all fields are required
    if([
        email, password
    ].some((field)=>{ field?.trim() === ""})){
        throw new ApiError(400, "All fields are required!!!");
    }

    // password is incorrect
    const user = await User.find({email});
    if(!user.isPasswordCorrect(password)){
        throw new ApiError(401, "Invalid credentails!!!");
    }

    // create accesstoken and refreshtoken
    const accessToken = generateAccessTokenAndrefreshToken(user._id);
    const loggedInUser = await User.find(Selection(
        "-password -refreshToken"
    ));
    
    res.status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", user.refreshToken)
    .json(
        new ApiResponse(
            200,
            loggedInUser,
            "Successfully logged In"
        )
    )
});

export { registerUser, loginUser };
