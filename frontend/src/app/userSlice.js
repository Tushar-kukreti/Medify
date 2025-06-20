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
      return res.data.data;
    } catch (err) {
      const msg = extractErrorMessage(err);
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
      });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
