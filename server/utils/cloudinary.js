import {v2 as cloudinary} from 'cloudinary';
// const {v2 as cloudinary}  = require('cloudinary');
import fs from "fs";

const CLOUDINARY_CLOUD_NAME = 'dlzrtxd7e'
const CLOUDINARY_API_KEY = '722663332172759'
const CLOUDINARY_API_SECRET = 'kqr_PTrovUd0VZ6mj-hIV0zYJLs'           
cloudinary.config({ 
  cloud_name: CLOUDINARY_CLOUD_NAME, 
  api_key: CLOUDINARY_API_KEY, 
  api_secret: CLOUDINARY_API_SECRET 
});

const x = await process.env.CLOUDINARY_CLOUD_NAME
console.log( x, process.env.CLOUDINARY_API_KEY,process.env.CLOUDINARY_API_SECRET );

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null;
        console.log(localFilePath);
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        console.log(response, "cloudinary response !!!!!!!!!");
        // file has been uploaded successfully
        console.log("file is uploaded on cloudinary ", response.url);
        return response;
    } catch (error) {
        console.log("Error occured !!!");
        // remove the locally saved temporary file as upload operation failed
        fs.unlinkSync(localFilePath) 
        return null;
    }
}

export default uploadOnCloudinary;