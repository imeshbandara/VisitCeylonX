import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPlaces } from '../api.js'; // ඔයාගේ දැනට තියෙන Axios API ෆයිල් එක

// 🛠️ 1. Create Async Thunk: Backend එකෙන් ස්ථාන දත්ත ඇදලා ගැනීම
export const getGlobalPlaces = createAsyncThunk(
  'places/getGlobalPlaces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchPlaces();
      // Axios response එකේ ව්‍යුහය අනුව නිවැරදි දත්ත කොටස ලබා ගැනීම
      const actualData = response?.data?.data || response?.data || response;
      return actualData;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch destination registry.");
    }
  }
);

// 🎯 2. Create the Slice
const placesSlice = createSlice({
  name: 'places',
  initialState: {
    allPlaces: [],
    loading: false,
    error: null,
  },
  reducers: {}, // මෙතනට synchronous reducers අවශ්‍ය නැත
  extraReducers: (builder) => {
    builder
      .addCase(getGlobalPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGlobalPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.allPlaces = action.payload; // දත්ත Global Store එකට ඇතුලත් කිරීම
      })
      .addCase(getGlobalPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default placesSlice.reducer;