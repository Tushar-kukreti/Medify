// src/app/userSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Base URLs from env (use proxy in dev so these become relative)
const API_BASE = import.meta.env.VITE_BASE_URL;
const REGISTER_URL = `${API_BASE}/register`;
const LOGIN_URL    = `${API_BASE}/login`;
const LOGOUT_URL   = `${API_BASE}/logout`;
const USER_URL     = `${API_BASE}/currentUser`;
const REFRESH_URL  = `${API_BASE}/refreshAccessToken`;
const UPDATE_USER_URL = `${API_BASE}/update`;
const CHANGE_PASSWORD_URL = `${API_BASE}/changePassword`;
// Helper to pull out a clean message
const extractErrorMessage = (err) => {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  return err.message || "Something went wrong";
};

// ────────────────────────────────────────────────────────────────────────────
// REFRESH ACCESS TOKEN
export const refreshAccessToken = createAsyncThunk(
  'user/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        REFRESH_URL,
        {},
        { withCredentials: true, timeout: 15000 }
      );
      const { accessToken } = res.data.data;
      localStorage.setItem("token", accessToken);
      return accessToken;
    } catch (error) {
      const msg = extractErrorMessage(error);
      return rejectWithValue(msg);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER
export const registerUser = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        REGISTER_URL,
        formData,
        {
          withCredentials: true,
          timeout: 15000,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data.data;
    } catch (err) {
      const msg = extractErrorMessage(err);
      toast.error(msg, { position: "bottom-left" });
      return rejectWithValue(msg);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        LOGIN_URL,
        { email, password },
        { withCredentials: true, timeout: 15000 }
      );
      const { user, accessToken, refreshToken } = res.data.data;
      localStorage.setItem("token", accessToken);
      return { user, accessToken, refreshToken };
    } catch (err) {
      const msg = extractErrorMessage(err);
      toast.error(msg, { position: "bottom-left" });
      return rejectWithValue(msg);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// FETCH CURRENT USER
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        USER_URL,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // toast.success("Fetched User", { position: "bottom-left" });
      return res.data.data;
    } catch (err) {
      const msg = extractErrorMessage(err);
      // toast.error(msg, { position: "bottom-left" });
      return rejectWithValue(msg);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// LOGOUT
export const logOutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        LOGOUT_URL,
        {},
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("token");
      return;
    } catch (err) {
      const msg = extractErrorMessage(err);
      toast.error(msg, { position: "bottom-left" });
      return rejectWithValue(msg);
    }
  }
);

const CHANGE_PASSWORD_ENDPOINT = "/change-password";

// ─────────────────────────────────────────────────────────────────────────────
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        CHANGE_PASSWORD_URL,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      toast.success(response.data.message || "Password changed successfully.");
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to change password.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
export const updateUserDetails = createAsyncThunk(
  "user/updateUserDetails",
  async (userData, { rejectWithValue }) => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries(userData).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
      );

      const res = await axios.patch(
        UPDATE_USER_URL,
        cleanedData,
        { withCredentials: true }
      );

      toast.success("Profile updated successfully");
      return res.data.data; // updated user
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to update profile";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
const initialState = {
  loading: false,
  userInfo: null,
  accessToken: null,
  refreshToken: null,
  error: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false; state.isLoggedIn = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userInfo = payload.user;
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoggedIn = false;
      })

      // FETCH_USER
      .addCase(fetchUser.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userInfo = payload;
        state.isLoggedIn = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userInfo = null;
        state.isLoggedIn = false;
      })

      // LOGOUT
      .addCase(logOutUser.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(logOutUser.fulfilled, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userInfo = null;
        state.isLoggedIn = false;
      })
      // UPDATE_USER_DETAILS
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Password change cases
      .addCase(changePassword.pending, (state) => {
        state.changePasswordLoading = true;
        state.changePasswordError = null;
        state.changePasswordSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changePasswordLoading = false;
        state.changePasswordSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordLoading = false;
        state.changePasswordError = action.payload;
        state.changePasswordSuccess = false;
      });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
