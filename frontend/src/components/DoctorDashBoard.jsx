import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClockIcon, PlusCircleIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchTimeSlots, createTimeSlots, deleteTimeSlot } from "../app/timeslotSlice";
import Loading from "./Loading";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const next7Dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      value: d.toISOString().split("T")[0],
      label: d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    };
  });

  const { userInfo } = useSelector((state) => state.user);

  const { slots, loading, error } = useSelector((state) => state.timeslot);

  const [selectedDate, setSelectedDate] = useState(next7Dates[0].value);
  const [timeInput, setTimeInput] = useState({ start: "", end: "" });

  useEffect(() => {
    if (userInfo?._id && selectedDate) {
      dispatch(fetchTimeSlots({ date: selectedDate, doctorId: userInfo._id }));
    }
  }, [dispatch, userInfo, selectedDate]);

  const handleAddSlot = async () => {
    const { start, end } = timeInput;
    if (!start || !end) return;
    const action = await dispatch(
      createTimeSlots({ date: selectedDate, slots: [{ startTime: start, endTime: end }] })
    );
    if (createTimeSlots.fulfilled.match(action) && action.payload) {
      setTimeInput({ start: "", end: "" });
      dispatch(fetchTimeSlots({ date: selectedDate, doctorId: userInfo._id }));
    }
  };

  const handleDelete = async (id) => {
    const action = await dispatch(deleteTimeSlot(id));
    if (deleteTimeSlot.fulfilled.match(action)) {
      dispatch(fetchTimeSlots({ date: selectedDate, doctorId: userInfo._id }));
    }
  };

  return (
    (userInfo && userInfo.role === "doctor") ?
    <div className="p-6">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">{`Welcome ${userInfo.fullName}`}</h1>
        <p className="text-gray-600">Manage Appointment Slots (Next 7 Days)</p>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Controls */}
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border-gray-200 rounded p-2"
            >
              {next7Dates.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <ClockIcon className="inline w-5 h-5 mr-1 text-indigo-500" /> Start Time
              </label>
              <input
                type="time"
                value={timeInput.start}
                onChange={(e) => setTimeInput((t) => ({ ...t, start: e.target.value }))}
                className="w-full border-gray-200 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <ClockIcon className="inline w-5 h-5 mr-1 text-indigo-500" /> End Time
              </label>
              <input
                type="time"
                value={timeInput.end}
                onChange={(e) => setTimeInput((t) => ({ ...t, end: e.target.value }))}
                className="w-full border-gray-200 rounded p-2"
              />
            </div>
            <button
              onClick={handleAddSlot}
              className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-2xl shadow"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" /> Add Slot
            </button>
          </div>
        </div>

        {/* Slot List */}
        <div>
          <h2 className="text-2xl font-medium text-gray-800 mb-4">
            Slots for {new Date(selectedDate).toLocaleDateString()}
          </h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : slots.length === 0 ? (
            <p className="text-gray-500">No slots for this date.</p>
          ) : (
            <div className="space-y-3">
              {slots.map((slot) => (
                <motion.div
                  key={slot._id || `${slot.startTime}-${slot.endTime}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between bg-gray-100 p-3 rounded-xl"
                >
                  <span className="text-gray-700">
                    {slot.startTime} - {slot.endTime}
                  </span>
                  <button onClick={() => handleDelete(slot._id)}>
                    <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-600" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div> : <Loading isLoading={0} text={'Page Only For Doctors'} />
  );
}