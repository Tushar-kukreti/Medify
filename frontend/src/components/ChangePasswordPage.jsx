import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../app/userSlice";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    changePasswordLoading,
    changePasswordError,
    changePasswordSuccess,
  } = useSelector((state) => state.user);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (changePasswordSuccess) {
      dispatch(changePassword());
      navigate("/profile");
    }
  }, [changePasswordSuccess, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      return setError("Please fill in all fields.");
    }
    if (newPassword !== confirmPassword) {
      return setError("New passwords do not match.");
    }
    if (newPassword.length < 6) {
      return setError("New password must be at least 6 characters.");
    }

    dispatch(changePassword({ oldPassword, newPassword }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Old Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">New Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Confirm New Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {(error || changePasswordError) && (
            <p className="text-red-500 text-sm">
              {error || changePasswordError}
            </p>
          )}

          <button
            type="submit"
            disabled={changePasswordLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {changePasswordLoading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
