import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
import { ApiError } from '../utils/ApiError.util.js';
export const connect_db = async ()=>{
    try{
        const response = await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)
        console.log('Connected to DB at host address : ', response.connection.host);
    }catch(err){
        throw new ApiError(400, "Failed to connect to DB", err);
    }
}