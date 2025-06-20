import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';
const SEARCH_ENDPOINT = import.meta.env.VITE_SEARCH_ENDPOINT || '/api/doctors';
const FETCH_DOCTOR_ENDPOINT = import.meta.env.VITE_FETCH_DOCTOR_ENDPOINT || 'searchDoctor';

// Async thunk: search for doctors with filters
export const searchDoctors = createAsyncThunk(
  'search/searchDoctors',
  async (filters, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/${SEARCH_ENDPOINT}`, 
        { 
            params: filters,
            // headers: {
            //     Authorization: `Bearer ${token}`,
            //     withCredentials: true,
            // }
        });
        // console.log('Search response:', res.data.data.doctors, res.data.data.pagination);
      return {
        doctors: res.data.data.doctors,
        pagination: res.data.data.pagination,
      };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Search failed');
      return rejectWithValue(error?.response?.data?.message || 'Something went wrong');
    }
  }
);
export const fetchDoctor = createAsyncThunk(
  'search/doctor',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/${FETCH_DOCTOR_ENDPOINT}`, {
        params: { id },
      });
      return response.data.data;
    } catch (err) {
      const message = err?.response?.data?.message || 'Search failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    doctors: [],
    pagination: {
      total: 0,
      totalPages: 1,
      currentPage: 1,
      limit: 6,
    },
    loading: false,
    error: null,
    selectedDoctor:null,
  },
  reducers: {
    resetSearchState: (state) => {
      state.doctors = [];
      state.pagination = {
        total: 0,
        totalPages: 1,
        currentPage: 1,
        limit: 6,
      };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.doctors;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.doctors = [];
      })
      .addCase(fetchDoctor.pending, (state, action)=> {
        state.loading = true;
        state.error = null;
        state.selectedDoctor = [];
      })
      .addCase(fetchDoctor.fulfilled, (state, action) => {
        state.selectedDoctor = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchDoctor.rejected, (state, action) => {
        state.selectedDoctor = [];
        state.loading = false;
        state.error = action.payload;
      });
    },
});

export const { resetSearchState } = searchSlice.actions;
export default searchSlice.reducer;
