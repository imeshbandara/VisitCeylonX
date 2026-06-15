import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const WEATHER_API_KEY = "0811c3ae7e13ff70a860362960455f63";

// 🛠️ 1. Create Async Thunk: API එකෙන් දත්ත ඇදලා ගන්නා ක්‍රියාවලිය (Asynchronous Action)
export const fetchWeatherAndForecast = createAsyncThunk(
  'weather/fetchWeatherAndForecast',
  async (city, { rejectWithValue }) => {
    try {
      const currentWeatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},LK&units=metric&appid=${WEATHER_API_KEY}`
      );
      
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city},LK&units=metric&appid=${WEATHER_API_KEY}`
      );

      // Forecast Data Filtering Matrix (දහවල් 12:00 දත්ත වෙන් කිරීම)
      const dailyForecasts = forecastRes.data.list.filter((item) => {
        return item.dt_txt.includes("12:00:00");
      }).map((item) => {
        const date = new Date(item.dt * 1000);
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          icon: item.weather[0].icon,
          condition: item.weather[0].main,
          max: Math.round(item.main.temp_max),
          min: Math.round(item.main.temp_min),
          rain: Math.round(item.pop * 100)
        };
      });

      return {
        current: currentWeatherRes.data,
        forecast: dailyForecasts
      };
    } catch (err) {
      return rejectWithValue("Destination not found or network error.");
    }
  }
);

// 🎯 2. Create the Slice: State සහ Reducers නිර්මාණය
const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    currentData: null,
    forecastData: [],
    loading: false,
    error: null,
    activeCity: 'Colombo'
  },
  reducers: {
    // සාමාන්‍ย synchronous වෙනස්කම් සඳහා (උදා: සර්ච් කරන නම වෙනස් කිරීම)
    setActiveCity: (state, action) => {
      state.activeCity = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherAndForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherAndForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.currentData = action.payload.current;
        state.forecastData = action.payload.forecast;
      })
      .addCase(fetchWeatherAndForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setActiveCity } = weatherSlice.actions;
export default weatherSlice.reducer;