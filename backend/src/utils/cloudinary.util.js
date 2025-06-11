import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import {ApiError} from './ApiError.util.js';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadOnCloudinary = async (localPath)=>{
    if (!localPath.trim()){
        fs.unlinkSync(localPath);
        throw new ApiError(400, "File Local Path is required for upload");
    }
    try{
        const response = await cloudinary.uploader.upload(localPath, {resource_type: "auto"});
        fs.unlinkSync(localPath);
        console.log('File Upload Successfull.');
        return response;
    }catch(error){
        fs.unlinkSync(localPath);
        console.log('cloudinary upload error : ', error);
        throw new ApiError(400, "Error While Uploading file to Cloudinary.", error);
    }
}