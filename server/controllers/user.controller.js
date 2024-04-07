import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import uploadOnCloudinary from "../utils/cloudinary.js";
import  ApiResponse from "../utils/ApiResponse.js";

const generateAccessAndrefreshToken = asyncHandler(async(id) =>{
    const user = await User.findById(id);
    // console.log(user.firstName, id);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // console.log(accessToken, refreshToken);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
    return { accessToken, refreshToken };
});
const registerUser = asyncHandler(async (req, res) => {
    // destructure all the fields
    const {email, password, firstName, lastName, country, occupation} = req.body;
    
    // if any of required fields are empty
    if([
        email, password, firstName, lastName, country, occupation
    ].some((field)=>{ field?.trim() === ""})
    ){
        throw new ApiError(400, "All fields are required!!!");
    }

    // email already registered
    const userExist = await User.findOne({email});
    if(userExist){
        throw new ApiError(409, "Email is already registered!!!");
    }

    // console.log(req.body);
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
        country,
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

    // not registered
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(404, "User does not exist!!!");
    }

    // password is incorrect
    if(!user.isPasswordCorrect(password)){
        throw new ApiError(401, "Invalid credentails!!!");
    }

    // console.log("acccess token" ,await user.generateAccessToken());
    // console.log("refresh token" ,await user.generateRefreshToken());
    const { accessToken, refreshToken } = await generateAccessAndrefreshToken(user._id);
    // console.log("AccessToken ",accessToken );
    // create accesstoken and refreshtoken
    // const { accessToken, refreshToken } = await generateAccessTokenAndrefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged In Successfully"
        )
    );
});

export { registerUser, loginUser };
