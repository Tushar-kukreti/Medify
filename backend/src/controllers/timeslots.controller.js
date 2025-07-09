import mongoose from "mongoose";
import { TimeSlot } from "../models/timeslots.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import moment from "moment";

// Binary search to find the index of the slot with endTime >= newStart
const findJustAfterSlotIndex = (slots, newStart) => {
  let left = 0, right = slots.length - 1, ans = slots.length;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const end = moment(slots[mid].endTime, "hh:mm A");
    if (end.isSameOrAfter(newStart)) {
      ans = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return ans;
};

// Binary search to find the index of the slot with startTime <= newEnd
const findJustBeforeSlotIndex = (slots, newEnd) => {
  let left = 0, right = slots.length - 1, ans = -1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const start = moment(slots[mid].startTime, "hh:mm A");
    if (start.isSameOrBefore(newEnd)) {
      ans = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return ans;
};

const createTimeSlot = asyncHandler(async (req, res) => {
  const { date, slots } = req.body;

  console.log("Received date:", date);
  console.log("Received slots:", slots);
  if (!date || isNaN(new Date(date))) throw new ApiError(400, "Invalid Date");
  if (!slots || !Array.isArray(slots) || slots.length === 0)
    throw new ApiError(400, "Invalid/Empty Slots");

  const user = await User.findById(req?.user?._id);
  if (!user) throw new ApiError(404, "User not found");
  if (user?.role !== "doctor") throw new ApiError(401, "Unauthorized request");

  const existingSlots = await TimeSlot.find({ doctor: user._id, date }).lean();
  existingSlots.sort((a, b) =>
    moment(a.startTime, "hh:mm A").diff(moment(b.startTime, "hh:mm A"))
  );

  const nonOverlappingSlots = [];

  for (const { startTime, endTime } of slots) {
    if (!startTime || !endTime) continue;

    const newStart = moment(startTime, "hh:mm A");
    const newEnd = moment(endTime, "hh:mm A");
    let overlaps = false;

    // check for diff in start and end time
    const diffInMin = newEnd.diff(newStart, "minutes");

    if (diffInMin < 30) continue;
    const fullStart = moment(`${date} ${startTime}`, "YYYY-MM-DD hh:mm A");
    const fullEnd = moment(`${date} ${endTime}`, "YYYY-MM-DD hh:mm A");

    // Skip if end time is in the past
    if (fullEnd.isBefore(moment())) continue;

    // Check slot that ends just after or at newStart
    const idxAfter = findJustAfterSlotIndex(existingSlots, newStart);
    if (idxAfter < existingSlots.length) {
      const slot = existingSlots[idxAfter];
      const existStart = moment(slot.startTime, "hh:mm A");
      const existEnd = moment(slot.endTime, "hh:mm A");

      if (newStart.isBetween(existStart, existEnd, null, "[)")) {
        overlaps = true;
      }
    }

    // Check slot that starts just before or at newEnd
    const idxBefore = findJustBeforeSlotIndex(existingSlots, newEnd);
    if (idxBefore >= 0) {
      const slot = existingSlots[idxBefore];
      const existStart = moment(slot.startTime, "hh:mm A");
      const existEnd = moment(slot.endTime, "hh:mm A");

      if (newEnd.isBetween(existStart, existEnd, null, "(]")) {
        overlaps = true;
      }
    }

    if (!overlaps) {
      nonOverlappingSlots.push({
        doctor: user._id,
        date,
        startTime,
        endTime,
        isBooked: false
      });
    }
  }

  if (nonOverlappingSlots.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, "No new non-overlapping time slots to add"));
  }

  const created = await TimeSlot.insertMany(nonOverlappingSlots);

  return res
    .status(201)
    .json(new ApiResponse(201, `${created.length} unique time slot(s) added successfully`, nonOverlappingSlots));
});

// DELETE /timeslots/:id
const deleteTimeSlot = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid time‐slot ID");
  }

  // Find the slot
  const slot = await TimeSlot.findById(id);
  if (!slot) {
    throw new ApiError(404, "Time‐slot not found");
  }

  // Only the owning doctor can delete
  if (slot.doctor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this slot");
  }
  if (slot.isBooked) {
    throw new ApiError(400, "Cannot delete a booked slot");
  }

  await slot.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, "Time‐slot deleted successfully", { id }));
});

const getTimeSlots = asyncHandler(async (req, res) => {
  const date = req?.query?.date?.trim();
  const doctorId = req?.query?.doctorId;
  const isBooked = req?.query?.isBooked || 0;

  if (!date || isNaN(new Date(date))) 
    throw new ApiError(400, "Invalid Input fields");
  if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) 
    throw new ApiError(404, "Doctor not found.");
  
  const doctor = await User.findOne({_id:doctorId, role: "doctor"});
  if (!doctor) throw new ApiError(404, "Doctor not found");

  if ((doctor._id.toString() !== req.user?._id?.toString()) && isBooked === "1")
    throw new ApiError(401, "Unauthorised Request");

  let filter = {date: date, doctor: doctor};
  if (isBooked === "1") filter.isBooked = true;
  else filter.isBooked = false;

  const timeslots = await TimeSlot.find(filter).sort({startTime:1});
  
  return res
  .status(200)
  .json(new ApiResponse(200, "Successfully Fetched all timeslots.", timeslots));
})

const updateSlot = asyncHandler(async (req, res) => {
  
})
export { createTimeSlot, getTimeSlots, deleteTimeSlot};