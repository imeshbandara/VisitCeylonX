import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEvents } from '../api.js'; // ඔයාගේ දැනට තියෙන Axios API ෆයිල් එක

// 🛠️ 1. Create Async Thunk: Backend එකෙන් Events දත්ත ඇදලා ගැනීම
export const getGlobalEvents = createAsyncThunk(
  'events/getGlobalEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchEvents();
      // Axios response එකේ structure එක අනුව නිවැරදි දත්ත කොටස වෙන් කර ගැනීම
      const actualData = response?.data?.data || response?.data || response;
      return actualData;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch cultural events database.");
    }
  }
);

// 🎯 2. Create the Slice
const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    allEvents: [],
    loading: false,
    error: null,
  },
  reducers: {}, // මෙතනට synchronous reducers අවශ්‍ය නැත
  extraReducers: (builder) => {
    builder
      .addCase(getGlobalEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGlobalEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.allEvents = action.payload; // දත්ත Global Store එකට ඇතුලත් කිරීම
      })
      .addCase(getGlobalEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eventsSlice.reducer;