import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice.js';

export const store = configureStore({
  reducer: {
    weather: weatherReducer, // passe placeReducer, eventReducer unah methnt ekathu karanna puluwn
  },
});