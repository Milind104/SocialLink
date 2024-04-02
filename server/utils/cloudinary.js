import {v2 as cloudinary} from 'cloudinary';
// const {v2 as cloudinary}  = require('cloudinary');
const fs = require('fs');

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null;

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })

        // file has been uploaded successfully
        console.log("file is uploaded on cloudinary ", response.url);
        return response;
    } catch (error) {
        // remove the locally saved temporary file as upload operation failed
        fs.unlinkSync(localFilePath) 
        return null;
    }
}

export default uploadOnCloudinary;