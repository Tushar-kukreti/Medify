import dotenv from 'dotenv';
dotenv.config({path:"./.env"});

import { connect_db } from "./db/main.db.js";
import { ApiError } from "./utils/ApiError.util.js";
import app from "./app.js";


const PORT = process.env.PORT || 5000;

connect_db().then(()=>{
    app.listen(PORT, ()=> console.log('Listening at PORT : ', PORT))
}).catch((err)=>{
    throw new ApiError(400, "DB Connection Failed", err);
})