import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrashIcon, HistoryIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAppointments, cancelAppointments } from "../app/appointmentSlice";

export default function DoctorAppointments() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  let { appointments, pagination, loading, error } = useSelector(
    (state) => state.appointment.appointments
  );

  appointments = appointments || [];
  const [view, setView] = useState("upcoming"); // 'upcoming' or 'previous'

  useEffect(() => {
    if (userInfo && userInfo.role !== "doctor") navigate("/");
  }, [userInfo, navigate]);

  useEffect(() => {
    if (!userInfo?._id) return;

    const page = 1;
    const limit = 50;

    const payload =
      view === "upcoming"
        ? { status: "", page, limit }
        : { status: "Completed,Cancelled", page, limit };

    dispatch(fetchAppointments(payload));
  }, [dispatch, userInfo, view]);

  const handleCancel = async (id) => {
    await dispatch(cancelAppointments([id]));
    const page = pagination.currentPage || 1;
    const limit = pagination.limit || 20;
    dispatch(fetchAppointments({ status: "", page, limit }));
  };

  return (
    <div className="p-6">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">My Appointments</h1>
        <p className="text-gray-600">View & manage patient bookings</p>
      </header>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        {/* View Tabs */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            className={`px-4 py-2 rounded-full ${
              view === "upcoming"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setView("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              view === "previous"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setView("previous")}
          >
            Previous
          </button>
        </div>

        {/* Appointments */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-500">No appointments found.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => {
              const isCancelledOrCompleted =
                appt.status === "Cancelled" || appt.status === "Completed";

              if (view === "upcoming" && isCancelledOrCompleted) return null;
              if (view === "previous" && !isCancelledOrCompleted) return null;

              const dateInfo = appt.timeSlot
                ? `${new Date(appt.timeSlot.date).toLocaleDateString()} ${
                    appt.timeSlot.startTime
                  } - ${appt.timeSlot.endTime}`
                : `${new Date(
                    appt.cancelledSlotInfo?.date
                  ).toLocaleDateString()} ${appt.cancelledSlotInfo?.startTime} - ${
                    appt.cancelledSlotInfo?.endTime
                  }`;

              return (
                <motion.div
                  key={appt._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between bg-gray-100 p-4 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-gray-800">{dateInfo}</p>
                    <p className="text-gray-700">
                      Patient: {appt.patient?.fullName}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        appt.status === "Cancelled"
                          ? "text-red-500"
                          : appt.status === "Completed"
                          ? "text-green-600"
                          : "text-indigo-600"
                      }`}
                    >
                      Status: {appt.status}
                    </p>
                  </div>
                  {appt.status === "Scheduled" && (
                    <button
                      onClick={() => handleCancel(appt._id)}
                      className="flex items-center text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="w-5 h-5 mr-1" /> Cancel
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
