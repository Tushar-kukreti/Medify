// Updated ProfilePage with visual field editing instead of prompt()

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments, cancelAppointments } from "../app/appointmentSlice.js";
import { TrashIcon, PencilIcon, XIcon, CheckIcon } from "lucide-react";
import { man_img, woman_img } from "../assets/Doc/init.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { updateUserDetails } from "../app/userSlice.js";

const EditableField = ({ label, value, type = "text", editable = true, onSave, options }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(inputValue);
    setIsEditing(false);
  };

  return (
    <div className="flex justify-between items-center">
      <span className="font-medium text-gray-600">{label}:</span>
      <div className="flex items-center gap-2 text-gray-800">
        {isEditing ? (
          options ? (
            <select
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : type === "date" ? (
            <input
              type="date"
              value={inputValue?.slice(0, 10)}
              onChange={(e) => setInputValue(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
          )
        ) : (
          <span>{type === "date" && value ? new Date(value).toLocaleDateString() : value ?? "N/A"}</span>
        )}

        {editable && (
          isEditing ? (
            <>
              <button onClick={handleSave}>
                <CheckIcon className="w-4 h-4 text-green-600 hover:text-green-800" />
              </button>
              <button onClick={() => setIsEditing(false)}>
                <XIcon className="w-4 h-4 text-gray-500 hover:text-gray-700" />
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}>
              <PencilIcon className="w-4 h-4 text-indigo-500 hover:text-indigo-700" />
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default EditableField;
