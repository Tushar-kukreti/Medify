import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    timeSlot:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "TimeSlot",
        required:true
    },
    // date:{
    //     type: Date,
    //     required: true
    // },
    status:{
        type: String,
        enum:['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    reason:{
        type:String,
        default: "",
    },
    note:{
        type:String,
        default: "",
    },
    cancelledSlotInfo: {
        date: { type: Date },
        startTime: { type: String },
        endTime: { type: String }
    }

}, {timestamps:true})

export const Appointment = mongoose.model('Appointment', appointmentSchema);