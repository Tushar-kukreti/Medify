import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Base API URL (use Vite proxy or full URL)
const API_BASE = import.meta.env.VITE_BASE_URL;
const FETCH_TIMESLOT_URL = `${API_BASE}/getTimeSlots`;
const CREATE_TIMESLOT_URL = `${API_BASE}/create-timeslot`;
const DELETE_TIMESLOT_URL = `${API_BASE}/deleteTimeSlot`;

// Helper to extract error message
const extractErrorMessage = (err) => {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  return err.message || "Something went wrong";
};

// Fetch time slots for a given date and doctor
export const fetchTimeSlots = createAsyncThunk(
  "timeslot/fetchTimeSlots",
  async ({ date, doctorId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(FETCH_TIMESLOT_URL, {
        params: { date, doctorId, isBooked: 0 },
        withCredentials: true,
        timeout: 15000,
      });
      return res.data.data; // array of timeslot objects
    } catch (err) {
      const msg = extractErrorMessage(err);
      toast.error(msg, { position: "bottom-left" });
      return rejectWithValue(msg);
    }
  }
);

// Create new time slots for a date
export const createTimeSlots = createAsyncThunk(
  "timeslot/createTimeSlots",
  async ({ date, slots }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        CREATE_TIMESLOT_URL,
        { date, slots },
        {
          withCredentials: true,
          timeout: 15000,
        }
      );
      toast.success(res.data.message, { position: "bottom-left" });
      return res.data.data; // array of created slots
    } catch (err) {
      const msg = extractErrorMessage(err);
      toast.error(msg, { position: "bottom-left" });
      return rejectWithValue(msg);
    }
  }
);

// Delete a time‐slot by ID
export const deleteTimeSlot = createAsyncThunk(
  "timeslot/deleteTimeSlot",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${DELETE_TIMESLOT_URL}/${id}`,
        { withCredentials: true, timeout: 15000 }
      );
      toast.success("Time‐slot deleted successfully", { position: "bottom-left" });
      return id;
    } catch (err) {
      const msg = extractErrorMessage(err);
      toast.error(msg, { position: "bottom-left" });
      return rejectWithValue(msg);
    }
  }
);

const initialState = {
  loading: false,
  slots: [],
  error: null,
};

const timeslotSlice = createSlice({
  name: "timeslot",
  initialState,
  reducers: {
    clearSlots: (state) => {
      state.slots = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTimeSlots
      .addCase(fetchTimeSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeSlots.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.slots = payload;
      })
      .addCase(fetchTimeSlots.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // createTimeSlots
      .addCase(createTimeSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTimeSlots.fulfilled, (state, { payload }) => {
        state.loading = false;
        // append new slots to existing list
        if (payload) state.slots = [...state.slots, ...payload];
      })
      .addCase(createTimeSlots.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // deleteTimeSlot
      .addCase(deleteTimeSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTimeSlot.fulfilled, (state, { payload: id }) => {
        state.loading = false;
        state.slots = state.slots.filter((slot) => slot._id !== id && slot.id !== id);
      })
      .addCase(deleteTimeSlot.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearSlots } = timeslotSlice.actions;
export default timeslotSlice.reducer;
