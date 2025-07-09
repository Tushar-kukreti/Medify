// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import timeslotReducer from "./timeslotSlice.js";
import searchReducer from "./searchSlice.js";
import appointmentReducer from "./appointmentSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
    timeslot: timeslotReducer,
    appointment: appointmentReducer
  },
});
