import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 🛠️ Async Thunk: එකතු කරගත් සියලුම දත්ත Backend AI API එකට යවා Itinerary එක ලබා ගැනීම
export const generateAIItinerary = createAsyncThunk(
  'planner/generateAIItinerary',
  async (plannerData, { rejectWithValue }) => {
    try {
      // ඔයාගේ Backend AI Endpoint එක මෙතනට සම්බන්ධ කරන්න
     const response = await axios.post('http://localhost:5002/api/ai/generate-plan', plannerData);
      return response?.data?.itinerary || response?.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to finalize AI Travel Plan.");
    }
  }
);

const plannerSlice = createSlice({
  name: 'planner',
  initialState: {
    // Step-by-step Form inputs tracking matrix
    formData: {
      destinations: [], // e.g. ["Ella", "Kandy"]
      durationDays: 3,
      budgetType: 'Standard', // Luxury, Budget, Standard
      travelersCount: 1,
      interests: [] // e.g. ["Hiking", "Beaches", "Culture"]
    },
    generatedPlan: null, // AI එකෙන් එන අවසාන Plan එක සේව් වීමට
    currentStep: 1, // Form එකේ දැනට ඉන්න පියවර
    loading: false,
    error: null,
  },
  reducers: {
    // 1. තනි තනි input වෙනස් වන විට formData එක update කිරීමට
    updatePlannerFormField: (state, action) => {
      state.formData = {
        ...state.formData,
        ...action.payload
      };
    },
    // 2. ඊළඟ පියවරට යාමට (Next Step)
    nextPlannerStep: (state) => {
      state.currentStep += 1;
    },
    // 3. පරණ පියවරට ආපසු යාමට (Previous Step)
    prevPlannerStep: (state) => {
      if (state.currentStep > 1) state.currentStep -= 1;
    },
    // 4. මුළු Form එකම Clear කර මුල සිට ආරම්භ කිරීමට
    resetPlannerForm: (state) => {
      state.formData = { destinations: [], durationDays: 3, budgetType: 'Standard', travelersCount: 1, interests: [] };
      state.generatedPlan = null;
      state.currentStep = 1;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAIItinerary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateAIItinerary.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedPlan = action.payload; // AI Plan එක Store එකට ලොක් කිරීම
      })
      .addCase(generateAIItinerary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updatePlannerFormField, nextPlannerStep, prevPlannerStep, resetPlannerForm } = plannerSlice.actions;
export default plannerSlice.reducer;