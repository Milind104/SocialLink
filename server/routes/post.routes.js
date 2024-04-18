import express from "express";
import { createPost } from "../controllers/post.controller.js";
import upload from "../middleware/multer.js";
import verifyJWT from "../middleware/auth.middleware.js";
    
const Router = express();

Router.route('/create')
.post(verifyJWT,
    upload.fields([
    {
        name: "image",
        mxCount: 20
    },
    {
        name: "video",
        mxCount: 1
    }
]),createPost);

export default Router;