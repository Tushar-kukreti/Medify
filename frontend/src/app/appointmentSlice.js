import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Base API URL (via Vite proxy or full URL)
const API_BASE = import.meta.env.VITE_BASE_URL;
const BOOK_APPOINTMENT_URL  = `${API_BASE}/bookAppointment`;
const CHECK_APPOINTMENT_URL  = `${API_BASE}/checkAppointments`;
const CANCEL_APPOINTMENT_URL  = `${API_BASE}/cancelAppointments`;

// Helper to get a clean message
const extractErrorMessage = (err) => {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  return err.message || "Something went wrong";
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. Fetch all appointments for current user, with optional status & pagination
export const fetchAppointments = createAsyncThunk(
  "appointment/fetchAppointments",
  async ({ status = "", page = 1, limit = 10, date }, { rejectWithValue }) => {
    try {
      const res = await axios.get(CHECK_APPOINTMENT_URL, {
        params: { status, page, limit, date },
        withCredentials: true,
        timeout: 15000,
      });
      // res.data.data: { response: [...], totalCount, totalPages, currentPage }
      console.log("Fetched appointments:", res.data.data);
      return res.data.data;
    } catch (err) {
      const msg = extractErrorMessage(err);
      toast.error(msg, { position: "bottom-left" });
      return rejectWithValue(msg);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. Create (book) an appointment
export const createAppointment = createAsyncThunk(
  "appointment/createAppointment",
  async ({ slotId, reason = "", note = "" }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        BOOK_APPOINTMENT_URL,
        { slotId, reason, note },
        { withCredentials: true, timeout: 15000 }
      );
      toast.success(res.data.message, { position: "bottom-left" });
      return res.data.data; // usually {} or created appointment
    } catch (err) {
      const msg = extractErrorMessage(err);
      toast.error(msg, { position: "bottom-left" });
      return rejectWithValue(msg);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. Cancel one or more appointments
export const cancelAppointments = createAsyncThunk(
  "appointment/cancelAppointments",
  async (appointmentIds, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${CANCEL_APPOINTMENT_URL}`,
        { appointment: appointmentIds },
        { withCredentials: true, timeout: 15000 }
      );
      toast.success(res.data.message, { position: "bottom-left" });
      return appointmentIds; // return array of cancelled IDs
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
  appointments: [],      // list of fetched appointments
  pagination: null,      // { totalCount, totalPages, currentPage }
  error: null,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    clearAppointments: (state) => {
      state.appointments = [];
      state.pagination   = null;
      state.error        = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAppointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, { payload }) => {
        state.loading       = false;
        state.appointments  = payload;
        console.log("Fetched appointments:", payload);
        state.pagination    = {
          totalCount: payload.totalCount,
          totalPages: payload.totalPages,
          currentPage: payload.currentPage,
        };
      })
      .addCase(fetchAppointments.rejected, (state, { payload }) => {
        state.loading = false;
        state.error   = payload;
      })

      // createAppointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(createAppointment.fulfilled, (state) => {
        state.loading = false;
        // After booking, you may want to refetch appointments or slots
      })
      .addCase(createAppointment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error   = payload;
      })

      // cancelAppointments
      .addCase(cancelAppointments.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(cancelAppointments.fulfilled, (state, { payload: ids }) => {
        state.loading      = false;
        // Remove cancelled appointments from list

        state.appointments = state.appointments.filter(
          (appt) => !ids.includes(appt._id)
        );
      })
      .addCase(cancelAppointments.rejected, (state, { payload }) => {
        state.loading = false;
        state.error   = payload;
      });
  },
});

export const { clearAppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;
