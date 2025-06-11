import mongoose from "mongoose";
import { Appointment } from "../models/appointment.model.js";
import { TimeSlot } from "../models/timeslots.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import cron from "node-cron";
import moment from "moment";


export const autoCompleteAppointments = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      const now = moment();

      // 1. Auto-complete past appointments
      const appointments = await Appointment.find({ status: "Scheduled" }).populate("timeSlot");

      const toUpdate = appointments.filter(appt => {
        const { date, endTime } = appt.timeSlot || {};
        if (!date || !endTime) return false;

        const end = moment(date).set(moment(endTime, "hh:mm A").toObject());
        return now.isAfter(end);
      });

      for (let appt of toUpdate) {
        appt.status = "Completed";
        await appt.save();
      }

      console.log(`${toUpdate.length} appointment(s) marked completed.`);

      // 2. Delete outdated unbooked time slots
      const allSlots = await TimeSlot.find({ isBooked: false });
      const toDelete = [];

      for (let slot of allSlots) {
        const { date, endTime } = slot;
        console.log(date, endTime);
        const end = moment(date).set(moment(endTime, "hh:mm A").toObject());

        if (now.isAfter(end)) {
          toDelete.push(slot._id);
        }
      }

      if (toDelete.length) {
        await TimeSlot.deleteMany({ _id: { $in: toDelete } });
      }

      console.log(`Deleted ${toDelete.length} outdated time slots.`);

    } catch (err) {
      console.error("Cron job error:", err.message);
    }
  });
};

const createAppointment = asyncHandler(async (req, res) => {
    let {slotId, reason, note} = req.body;
    if (!slotId) throw new ApiError(400, "Slot id is required");
        console.log("slotId : ", slotId);
    slotId = slotId.trim();

    if (!mongoose.Types.ObjectId.isValid(slotId))
        throw new ApiError(400, "Invalid Slot id");

    const patient = await User.findById(req?.user?._id);
    if (!patient) throw new ApiError(404, "User not found");

    const slot = await TimeSlot.findById(slotId);
    if (!slot) throw new ApiError(404, "Slot not found");
    if (slot?.isBooked) throw new ApiError(401, "Slot is already booked");

    const appointment = await Appointment.create({
        doctor: slot?.doctor,
        patient: patient._id,
        timeSlot: slot._id,
        reason: (reason || ""),
        note: (note || ""),
        status: "Scheduled",
    })

    slot.isBooked = true;
    slot.bookedBy = patient._id;
    await slot.save();

    return res
    .status(200)
    .json(new ApiResponse(200, "Successfully Booked appointment", {}));
})

const getAllAppointments = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;
    const role = req?.user?.role;
    if (!userId || !role) throw new ApiError(400, "Invalid User");

    let status = req?.query?.status;
    status = (status) ? status.trim() : "";
    let filter = (role === 'doctor') ? {doctor:userId} : {patient:userId};
    if (status && status !== "") filter.status = status;

    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const skip = (page - 1) * limit;
    
    const response = await Appointment.find(filter)
    .populate('doctor', "fullName _id email")
    .populate('patient', "fullName _id email")
    .populate('timeSlot')
    .sort({created:-1})
    .skip(skip)
    .limit(limit);

    const totalCount = await Appointment.countDocuments(filter);
    return res
    .status(200)
    .json(new ApiResponse(200, "Successfully fetched all appointment.", {
        response,
        totalCount,
        totalPages: Math.ceil(totalCount/limit),
        currentPage: page,
    }));
})
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointmentIds = req?.body?.appointment;
  if (!appointmentIds || !Array.isArray(appointmentIds) || appointmentIds.length === 0) {
    throw new ApiError(400, "Invalid or empty appointment array.");
  }

  const user = await User.findById(req?.user?._id);
  if (!user) throw new ApiError(404, "User not found");

  const appointments = await Appointment.find({ _id: { $in: appointmentIds } }).populate('timeSlot');

  console.log(appointments, appointmentIds);
  if (appointments.length !== appointmentIds.length) {
    throw new ApiError(404, "Some appointments were not found.");
  }

  for (const appt of appointments) {
    if (!appt.timeSlot) continue; // Just in case

    // Add slot time info to appointment for history
    appt.status = 'Cancelled';
    appt.cancelledSlotInfo = {
      date: appt.timeSlot.date,
      startTime: appt.timeSlot.startTime,
      endTime: appt.timeSlot.endTime,
    };
    await appt.save();

    // Delete the associated timeslot
    await TimeSlot.findByIdAndDelete(appt.timeSlot._id);
  }

  return res.status(200).json(
    new ApiResponse(200, "Successfully cancelled all the appointments and deleted related slots.")
  );
});

export {createAppointment, getAllAppointments, cancelAppointment};