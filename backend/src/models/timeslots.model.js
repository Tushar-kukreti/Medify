import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.util.js";
import { User } from "./user.model.js";

const timeSlotSchema = mongoose.Schema({
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bookedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    date:{
        type: Date,
        required: true
    },
    startTime:{
        type: String,
        required: true,
    },
    endTime:{
        type: String,
        required: true,
    },
    isBooked:{
        type: Boolean,
        default: 0,
    }
}, {timestamp: true})

timeSlotSchema.index(
  { doctor: 1, date: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

export const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);