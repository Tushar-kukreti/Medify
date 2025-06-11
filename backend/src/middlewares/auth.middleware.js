import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.util.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
import { User } from '../models/user.model.js';

export const verifyJWT = asyncHandler(async(req,_,next)=>{
    try{
        const token = req.cookies?.accessToken || req.headers['Authorization']?.replace("Bearer ", "").trim();
        if (!token) throw new ApiError(401, "User Token not found");

        const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedUser) throw new ApiError(401, "Invalid or corrupted Token");

        const user = await User.findById(decodedUser.id);
        if (!user) throw new ApiError(404, "User Not Found");

        req.user = user;
        next();
    } catch(err){
        next(new ApiError(401, "Unauthorized : "));
    }
})