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
  const { slotId, reason = "", note = "" } = req.body;
  if (!slotId) throw new ApiError(400, "Slot id is required");

  if (!mongoose.Types.ObjectId.isValid(slotId))
    throw new ApiError(400, "Invalid Slot id");

  const patient = await User.findById(req.user._id);
  if (!patient) throw new ApiError(404, "User not found");

  const slot = await TimeSlot.findById(slotId);
  if (!slot) throw new ApiError(404, "Slot not found");
  if (slot.isBooked) throw new ApiError(409, "Slot is already booked");

  const [appointment] = await Promise.all([
    Appointment.create({
      doctor: slot.doctor,
      patient: patient._id,
      timeSlot: slot._id,
      reason,
      note,
      status: "Scheduled",
    }),

    (async () => {
      slot.isBooked = true;
      slot.bookedBy = patient._id;
      await slot.save();
    })(),
  ]);

  return res
    .status(201)
    .json(new ApiResponse(201, "Successfully booked appointment", { appointment }));
});
const getAllAppointments = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;
  if (!userId || !role) throw new ApiError(400, "Invalid User");

  const { status = "", page = 1, limit = 10, date } = req.query;

  const filter = {
    ...(role === "doctor" ? { doctor: userId } : { patient: userId }),
  };

  // Add status filter if provided
  if (status) {
    const allStatuses = status.split(",").map((s) => s.trim());
    filter.status = { $in: allStatuses };
  }

  // Add date filter if provided
  if (date) {
    const queryDate = new Date(date);
    if (isNaN(queryDate.getTime())) {
      throw new ApiError(400, "Invalid date format. Use YYYY-MM-DD.");
    }

    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);

    filter.date = {
      $gte: startOfDay,
      $lte: endOfDay,
    };

    console.log('Filtering by date from:', startOfDay.toISOString(), 'to', endOfDay.toISOString());
  } else {
    console.log('No date filter applied');
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [appointments, totalCount] = await Promise.all([
    Appointment.find(filter)
      .populate("doctor", "fullName email")
      .populate("patient", "fullName email")
      .populate("timeSlot")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10)),

    Appointment.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / parseInt(limit, 10));

  return res.status(200).json(
    new ApiResponse(200, "Fetched appointments", {
      appointments,
      pagination: {
        totalCount,
        totalPages,
        currentPage: parseInt(page, 10),
      },
    })
  );
});


const cancelAppointment = asyncHandler(async (req, res) => {
  const appointmentIds = req.body.appointment;
  if (!Array.isArray(appointmentIds) || appointmentIds.length === 0)
    throw new ApiError(400, "Invalid or empty appointment array");

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  const appointments = await Appointment.find({ _id: { $in: appointmentIds } })
    .populate("timeSlot");

  if (appointments.length !== appointmentIds.length)
    throw new ApiError(404, "Some appointments were not found");

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (const appt of appointments) {
      // Only allow cancel by doctor or patient
      if (![appt.doctor.toString(), appt.patient.toString()].includes(user._id.toString())) {
        throw new ApiError(403, "Not authorized to cancel this appointment");
      }

      appt.status = "Cancelled";
      appt.cancelledSlotInfo = {
        date: appt.timeSlot.date,
        startTime: appt.timeSlot.startTime,
        endTime: appt.timeSlot.endTime,
      };
      await appt.save({ session });

      // Delete the timeslot
      await TimeSlot.deleteOne({ _id: appt.timeSlot._id }, { session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(new ApiResponse(200, "Appointments cancelled and slots freed"));
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

export {createAppointment, getAllAppointments, cancelAppointment};