import mongoose, { Mongoose } from "mongoose";
import bcrypt from 'bcrypt';
import { ApiError } from "../utils/ApiError.util.js";
import jwt from 'jsonwebtoken';
import { DOCTOR_SPECIALIZATIONS } from "../constants.js";

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    fullName:{
        type:String,
        required:true,
        trim: true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
        trim: true,
        index: true
    },
    contact_number:Number,
    groupId:{
        type: String,
        enum: ['1','2','3','4','5','6'],
        required: function(){
            return this.role === 'doctor';
        }
    },
    specialization:{
        type: String,
        enum: DOCTOR_SPECIALIZATIONS,
        required: function(){
            return this.role === 'doctor';
        }
    },
    password:{
        type: String,
        required: true,
    },
    date_of_birth:{
        type:Date,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'doctor'],
        default: 'user',
    },
    certifications:{
        type: [String],
        required: function() {
            return this.role === 'doctor';
        }
    },
    experienceYears: {
        type: Number,
        required: function(){
            return this.role === 'doctor';
        }
    },
    gender:{
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    weight: {
        type:Number,
    },
    height:{
        type:Number,
    },
    dietary_preference:{
        type:String,
    },
    assigned_doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    subscription: {
        active: {type:Boolean, default: false},
        plan: String,
        StartedAt: Date,
        expiresAt: Date,
    },
    description:{
        type: String,
        default: "",
    },
    refreshToken: String,
    followers: {type:Number, default:0,},
    avatar:String,
    cover:String,
}, {timestamps:true})

userSchema.pre('save', async function(next){
    if (this.isModified('password') == false) return next();
    try{
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
    catch(err){
        throw new ApiError(500, 'Failed To Hash Password', err);
    }
})

userSchema.methods.checkPassword = async function (password){
    try{
        return await bcrypt.compare(password, this.password);
    }catch(err){
        throw new ApiError(500, 'Failed To Check User Password',err);
    };
}

userSchema.methods.getAccessToken = function(){
    return jwt.sign({
        id: this._id.toString(),
        userName: this.userName,
        fullName: this.fullName,
        email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
    })
}

userSchema.methods.getRefreshToken = function(){
    return jwt.sign({
        id: this._id.toString(),
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
    })
}
export const User = new mongoose.model("User", userSchema);