import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trime: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    },
    profileImg: {
        type: String,   // cloudinary img url
        default: "xyz"  // default img url
    },
    coverImg: {
        type: String,     // cloudinary img url
        default: "xyz"   // default img url
    },
    follower: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    location: {
        type: String,
    },
    occupation: {
        type: String,
    },
    viewedProfile: {
        type: Number,
    }
},{timestamps: true});

userShcema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
     
    this.password = bcrypt.hash(this.password, 10);
    next();
})

userShcema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userShcema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userShcema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
const User = mongoose.model("User", UserSchema);

export default User;