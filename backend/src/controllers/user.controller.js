import {ApiResponse} from '../utils/ApiResponse.util.js'
import { ApiError } from '../utils/ApiError.util.js'
import { User } from '../models/user.model.js'
import { asyncHandler } from '../utils/asyncHandler.util.js'
import { COOKIE_MAX_AGE } from '../constants.js'
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { uploadOnCloudinary } from '../utils/cloudinary.util.js'
import {SPECIALIZATION_TO_GROUPID} from '../constants.js'

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: COOKIE_MAX_AGE,
};

const generateTokens = async(userId)=>{
    try{
        const user = await User.findById(userId);
        const refreshToken = await user.getRefreshToken();
        const accessToken = await user.getAccessToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {refreshToken, accessToken};
    }catch(err){
        throw new ApiError(500, "Failed to generate tokens", err);
    }
}

const refreshAccessToken = asyncHandler(async(req, res)=>{
    const incommingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incommingRefreshToken) throw new ApiError(401, "Refresh Token not found");

    try{
        const decodedUser = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decodedUser) throw new ApiError(401, "User Refresh Token is invalid");

        const user = await User.findById(decodedUser.id);
        if (!user) throw new ApiError(404, "User not found");
        if (user.refreshToken !== incommingRefreshToken) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            throw new ApiError(401, "User Refresh Token doesn't match");
        }
        const {refreshToken, accessToken} = await generateTokens(user.id);

        return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, "SuccessFully Updated User Tokens",{
            refreshToken, accessToken
        }));
    }catch(err){
        throw new ApiError(401, "Error While refreshing User accessToken", err);
    }
})

const registerUser = asyncHandler(async (req, res) => {
    let avatarLocalPath, coverLocalPath, certificatePaths;
    if (req.files && Array.isArray(req.files.cover) && req.files.cover.length > 0)
        coverLocalPath = req.files.cover[0].path;

    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0)
        avatarLocalPath = req.files.avatar[0].path;

    if (req.files && Array.isArray(req.files.certificate) && req.files.certificate.length > 0)
        certificatePaths = req.files.certificate;

    try {
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
        if (req.files?.avatar?.[0] && !allowedMimeTypes.includes(req.files.avatar[0].mimetype)) {
            throw new ApiError(400, "Invalid avatar image format");
        }
        if (req.files?.cover?.[0] && !allowedMimeTypes.includes(req.files.cover[0].mimetype)) {
            throw new ApiError(400, "Invalid cover image format");
        }
        if (certificatePaths && Array.isArray(certificatePaths)){
            for (var i = 0; i < certificatePaths.length; i++){
                if (!allowedMimeTypes.includes(certificatePaths[i].mimetype)) {
                    throw new ApiError(400, "Invalid certificate image format");
                }
            }
        }

        let {fullName, userName, role, email, password, gender, weight, height, dietary_preference,AppointmentFee,
            description, date_of_birth, contact_number, groupId, specialization, experience:experienceYears, certificationsName} = req.body;
    
        email = email?.trim()?.toLowerCase();
        userName = userName?.trim()?.toLowerCase();
        fullName = fullName?.trim(); gender = gender?.trim();
        dietary_preference = dietary_preference?.trim(); description = description?.trim();
        role = (!role?.trim()) ? "user" : role?.trim();
        specialization = specialization?.trim()?.toLowerCase();

        // console.log("fullName : ", fullName, " userName : ", userName, " email : ", email, date_of_birth);
        if ([fullName, email, userName, password, gender].some(
            (field)=> (field == undefined || field === "")))throw new ApiError(400, "Missing User Details");
    
        if (!date_of_birth) throw new ApiError(400, "Missing User Details");
        weight = (weight) ? weight : null;
        height = (height) ? height : null;
        contact_number = (contact_number) ? contact_number : null;
        experienceYears = (experienceYears) ? experienceYears : null;

        description = (description) ? description : "";
        dietary_preference = (dietary_preference) ? dietary_preference : "";

        const existingUser = await User.findOne(
            {$or: [{email}, {userName}]}
        )
    
        if (existingUser){
            if (coverLocalPath) try{fs.unlinkSync(coverLocalPath)}catch{};
            if (avatarLocalPath) try{fs.unlinkSync(avatarLocalPath)}catch{};
            throw new ApiError(400, 'User Already Exist');
        }
    

        if (role === 'doctor'){
            if (!certificatePaths || !Array.isArray(certificatePaths) || certificatePaths.length == 0)
                throw new ApiError(400, "Certificates are required")
            if (!experienceYears)
                throw new ApiError(400, "Years of expirence is a required Field for doctors")
            if (!specialization) throw new ApiError(400, "Specialization is a required Field for doctors");
            if (!groupId) throw new ApiError(400, "GroupId is a required Field for doctors");
            // console.log("specialization : ", specialization, " groupId : ", groupId, SPECIALIZATION_TO_GROUPID[specialization]);
            if (SPECIALIZATION_TO_GROUPID[specialization]?.toString() !== groupId.toString()) {
            throw new ApiError(400, "MISMATCHED SPECIALIZATION AND GROUP ID");
            }
            if (!certificationsName || certificationsName === '') 
                throw new ApiError(400, "Missing Certificates Name");
            if (!AppointmentFee || AppointmentFee === '') throw new ApiError(400, "Missing Appointment Fee Details");
            AppointmentFee = Number(AppointmentFee);
        }

        const avatarImage = (avatarLocalPath) ? await uploadOnCloudinary(avatarLocalPath, "avatar") : null;
        const coverImage = (coverLocalPath) ? await uploadOnCloudinary(coverLocalPath, "cover") : null;
        
        let certificates = [];
        if (role === 'doctor') {
            certificates = await Promise.all(
                certificatePaths.map((cert, i) =>
                    uploadOnCloudinary(cert.path, `certificate-${i}`)
                )
            );
        }
        certificates = certificates.map((cert)=> cert = cert.secure_url);
        const user = new User({
            fullName, userName, email, password, gender, weight, height, dietary_preference,
            description, date_of_birth, role,
            avatar: (avatarImage) ? avatarImage.secure_url : "",
            cover: (coverImage) ? coverImage.secure_url : "",
            certifications: certificates,
            experienceYears: experienceYears,
            contact_number, groupId, specialization, certificationsName, AppointmentFee,
        })
        try {
            await user.save();
        } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            throw new ApiError(409, `Duplicate ${field}: "${err.keyValue[field]}" already exists.`);
        }
        throw new ApiError(500, "User creation failed", err);
        }

        const createdUser = await User.findById(user._id).select("-password -refreshToken");
        if (!createdUser) throw new ApiError(500, "Failed to create user");
        
        return res
        .status(200)
        .json(new ApiResponse(200, "User Registered Successfully", createdUser));
    
    } catch (error) {
        throw new ApiError(400, (error.message || "Error While Registering The User."), error);
    } finally {
        if (avatarLocalPath) try{ fs.unlinkSync(avatarLocalPath)}catch{};
        if (coverLocalPath) try{ fs.unlinkSync(coverLocalPath)}catch{};
        if (certificatePaths && Array.isArray(certificatePaths)) {
            for (let cert of certificatePaths) {
                try { fs.unlinkSync(cert.path); } catch {}
            }
        }
    }
}
)
const logInUser = asyncHandler(async (req, res) => {
    let {email, password} = req.body;
    if (!email?.trim() || !password?.trim()) throw new ApiError(401, "Missing User Details");

    const user = await User.findOne({email});
    if (!user) throw new ApiError(404, "User Not Found");

    const passwordMatch = await user.checkPassword(password);
    if (!passwordMatch) throw new ApiError(401, "Incorrect Password");

    // console.log(email, password, user._id);
    const {refreshToken, accessToken} = await generateTokens(user._id);
    // console.log(refreshToken, accessToken);
    const LoggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new ApiResponse(200, "User Logged In Successfully.", {
        user: LoggedInUser,
        accessToken, refreshToken
    }));
})

const logOutUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, "User Not Found");
    try{
        await User.findByIdAndUpdate(user._id,
            {
                $set:{refreshToken:undefined},
            },
            {new:true}
        )
        return res
        .status(200)
        .clearCookie("refreshToken", cookieOptions)
        .clearCookie("accessToken", cookieOptions)
        .json(new ApiResponse(200, "User LogOut Successfull.", {}));
    }catch(err){
        throw new ApiError(500, (err.message || "Error While User LogOut"));
    }
})

const getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) throw new ApiError(404, "User Not Found");
    const user = await User.findById(req.user?._id).select("-password -refreshToken");
    return res
    .status(200)
    .json(new ApiResponse(200, "User Fetched Successfully.", user));
})

const changePassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    if (!oldPassword?.trim() || !newPassword.trim()) throw new ApiError(401, "Missing Fields");

    console.log(oldPassword, newPassword);
    const user = await User.findById(req.user?._id);
    const passwordMatch = await user.checkPassword(oldPassword);
    if (!passwordMatch) throw new ApiError(401, "Wrong Password");

    user.password = newPassword;
    await user.save();
    return res
    .status(200)
    .json(new ApiResponse(200, "User Password Changed Successfully.", {}));
})

const updateDetails = asyncHandler(async (req, res) => {
    let {fullName, gender, weight, height, dietary_preference,
        contact_number, description, date_of_birth} = req.body;
    
    const fields = {fullName, contact_number, gender, weight, height, dietary_preference,
        description, date_of_birth};

    console.log("fullname : ", fullName);
    let changedFields = {};
    for (let key in fields){
        if (!fields[key]) continue;
        changedFields[key] = fields[key];
        if (typeof fields[key] === 'string') changedFields[key] = fields[key].trim();
    }

    if (Object.keys(changedFields).length === 0) throw new ApiError(400, "No Fields are provided for update")

    let user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User Not Found");

    user = await User.findByIdAndUpdate(user._id,
        {$set: {...changedFields}},
        {new:true}
    ).select('-password -refreshToken');

    return res
    .status(200)
    .json(new ApiResponse(200, "User Details Updated Successfully", user));
})

const updateAvatarAndCover = asyncHandler(async (req, res) => {
    let avatarLocalPath, coverLocalPath;
    if (req.files && Array.isArray(req.files.cover) && req.files.cover.length > 0)
        coverLocalPath = req.files.cover[0].path;

    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0)
        avatarLocalPath = req.files.avatar[0].path;

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (req.files?.avatar?.[0] && !allowedMimeTypes.includes(req.files.avatar[0].mimetype)) {
        throw new ApiError(400, "Invalid avatar image format");
    }
    if (req.files?.cover?.[0] && !allowedMimeTypes.includes(req.files.cover[0].mimetype)) {
        throw new ApiError(400, "Invalid cover image format");
    }
    
    try {
        let user = await User.findById(req.user?._id);
        if (!user) throw new ApiError(404, "User Not Found");
        if (!avatarLocalPath && !coverLocalPath) throw new ApiError(400, "No Image Found");
                
        const avatarImage = (avatarLocalPath) ? await uploadOnCloudinary(avatarLocalPath, "avatar") : null;
        const coverImage = (coverLocalPath) ? await uploadOnCloudinary(coverLocalPath, "cover"): null;

        user = await User.findByIdAndUpdate(user._id,
            {$set: {
                avatar: (avatarImage) ? avatarImage?.secure_url : "",
                cover: (coverImage) ? coverImage?.secure_url : ""
            }},
            {new:true}
        ).select("-password -refreshToken");

        return res
        .status(200)
        .json(new ApiResponse(200, "User Image Updated Successfully.", user));
    } catch (error) {
        throw new ApiError(400, "Error While Updating profile images", error);
    } finally {
        if (avatarLocalPath) try{ fs.unlinkSync(avatarLocalPath)}catch{};
        if (coverLocalPath) try{ fs.unlinkSync(coverLocalPath)}catch{};
    }
})

const listDoctors = asyncHandler(async (req, res) => {
    const groupId = req.query?.groupId?.trim() || null;
    const specialization = req.query?.specialization?.trim()?.toLowerCase() || null;

    if (groupId && !["1", "2", "3", "4", "5", "6"].includes(groupId)) {
        throw new ApiError(400, "Invalid Group ID");
    }

    let filter = {role: 'doctor'};
    if (specialization) filter.specialization = specialization;
    if (groupId) filter.groupId = groupId;

    const doctors = await User.find(filter).select("-password -refreshToken -__v");
    return res
    .status(200)
    .json(new ApiResponse(200, "Doctors Fetched Successfully", doctors));
})

const searchDoctor = asyncHandler(async (req, res) => {
    const doctorId = req.query?.id?.trim();
    if (!doctorId || doctorId === '') throw new ApiError(400, "Invalid Doctor Id");

    const doctor = await User.findById(doctorId).select("-password -refreshToken -__v");
    if (!doctor) throw new ApiError(404, "Doctor Not Found");
    if (doctor.role !== 'doctor') throw new ApiError(401, "Search Is only applicable for Doctors");

    console.log(doctor);
    return res
    .status(200)
    .json(new ApiResponse(200, "Doctors Details Fetched Successfully.", doctor));
});

const filterDoctors = asyncHandler(async (req, res) => {
    const {groupId,specialization,name,page = 1,limit = 10,sortBy = "fullName",order = "asc"} = req.query;

    if (groupId && !["1", "2", "3", "4", "5", "6"].includes(groupId)) {
        throw new ApiError(400, "Invalid Group ID");
    }

    const filter = { role: 'doctor' };

    if (specialization) {
        filter.specialization = specialization.trim().toLowerCase();
    }

    if (groupId) {
        filter.groupId = groupId.trim();
    }

    if (name?.trim()) {
        const terms = name.trim().split(/\s+/);
        const regexes = terms.map(term => new RegExp(term, 'i'));

        filter.$and = regexes.map(regex => ({
            fullName: { $regex: regex }
        }));
    }

    const sortOrder = order === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [doctors, total] = await Promise.all([
        User.find(filter)
            .select("-password -refreshToken -__v")
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(parseInt(limit)),
        User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json(
        new ApiResponse(200, "Doctors fetched successfully", {
            doctors,
            pagination: {
                total,
                totalPages,
                currentPage: parseInt(page),
                limit: parseInt(limit),
            }
        })
    );
});

export {
    registerUser, refreshAccessToken, generateTokens, logInUser, logOutUser,
    getCurrentUser, changePassword, updateDetails, updateAvatarAndCover, listDoctors, searchDoctor, filterDoctors
};