// Refactored ProfilePage with EditableField components for modern UI editing

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments, cancelAppointments } from "../app/appointmentSlice";
import { TrashIcon } from "lucide-react";
import { man_img, woman_img } from "../assets/Doc/init.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { updateUserDetails } from "../app/userSlice.js";
import EditableField from "./EditableField"; // Assumes the reusable component is in the same folder

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const { appointments = [], loading } = useSelector(
    (state) => state.appointment.appointments
  );
  const [view, setView] = useState("upcoming");

  useEffect(() => {
    if (userInfo?.role === "user") {
      const status = view === "upcoming" ? "Scheduled" : "Completed,Cancelled";
      dispatch(fetchAppointments({ status, page: 1, limit: 50 }));
    }
  }, [dispatch, userInfo, view]);

  if (!userInfo) return null;
  const isDoctor = userInfo.role === "doctor";

  const handleUpdate = (field, value) => {
    dispatch(updateUserDetails({ [field]: value }));
  };

  const editableFields = [
    { label: "Full Name", key: "fullName" },
    { label: "Gender", key: "gender", options: ["male", "female", "other"] },
    { label: "Weight", key: "weight" },
    { label: "Height", key: "height" },
    { label: "Dietary Preference", key: "dietary_preference" },
    { label: "Date of Birth", key: "date_of_birth", type: "date" },
    { label: "Contact Number", key: "contact_number" },
  ];

  const readOnlyFields = [
    { label: "Username", key: "userName" },
    { label: "Role", key: "role" },
    { label: "Email", key: "email" },
  ];

  const doctorFields = [
    { label: "Description", key: "description" },
    { label: "Appointment Fee", key: "appointmentFee", editable: false },
    { label: "Group ID", key: "groupId", editable: false },
    { label: "Specialization", key: "specialization", editable: false },
    { label: "Experience (Years)", key: "experience", editable: false },
    { label: "Certifications", key: "certificationsName", editable: false },
  ];

  const handleCancel = async (id) => {
    await dispatch(cancelAppointments([id]));
    dispatch(fetchAppointments({ status: "Scheduled,Completed,Cancelled", page: 1, limit: 50 }));
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <div className="flex flex-col items-center mb-6">
          <img
            src={userInfo.avatar || (userInfo.gender === "female" ? woman_img : man_img)}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow"
          />
          <h2 className="text-2xl font-bold mt-4 text-gray-800">Profile</h2>
        </div>

        {/* Editable and ReadOnly Fields */}
        <div className="grid gap-4 mb-6">
          {editableFields.map((f) => (
            <EditableField
              key={f.key}
              label={f.label}
              value={userInfo[f.key]}
              onSave={(val) => handleUpdate(f.key, val)}
              editable
              type={f.type}
              options={f.options}
            />
          ))}
          {readOnlyFields.map((f) => (
            <EditableField
              key={f.key}
              label={f.label}
              value={userInfo[f.key]}
              editable={false}
            />
          ))}
        </div>

        {isDoctor && (
          <>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Doctor Info</h3>
            <div className="grid gap-4 mb-6">
              {doctorFields.map((f) => (
                <EditableField
                  key={f.key}
                  label={f.label}
                  value={userInfo[f.key]}
                  editable={f.editable !== false}
                  onSave={(val) => handleUpdate(f.key, val)}
                />
              ))}
            </div>
          </>
        )}

        <div className="text-center mb-10">
          <button
            onClick={() => navigate("/change-password")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          >
            Change Password
          </button>
        </div>

        {userInfo.role === "user" && (
          <>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Your Appointments</h3>
            <div className="flex justify-center gap-4 mb-4">
              <button
                className={`px-4 py-2 rounded-full ${
                  view === "upcoming" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setView("upcoming")}
              >
                Upcoming
              </button>
              <button
                className={`px-4 py-2 rounded-full ${
                  view === "previous" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setView("previous")}
              >
                Previous
              </button>
            </div>

            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : appointments.length === 0 ? (
              <p className="text-center text-gray-500">No appointments found.</p>
            ) : (
              <div className="space-y-4">
                {appointments.map((appt) => {
                  const isCancelledOrCompleted =
                    appt.status === "Cancelled" || appt.status === "Completed";
                  if (view === "upcoming" && isCancelledOrCompleted) return null;
                  if (view === "previous" && !isCancelledOrCompleted) return null;

                  const timeSlot = appt.timeSlot || appt.cancelledSlotInfo;
                  const dateInfo = timeSlot
                    ? `${new Date(timeSlot.date).toLocaleDateString()} ${
                        timeSlot.startTime
                      } - ${timeSlot.endTime}`
                    : "No time info";

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
                        <p className="text-gray-700">Doctor: {appt.doctor?.fullName}</p>
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
          </>
        )}
      </div>
    </div>
  );
}