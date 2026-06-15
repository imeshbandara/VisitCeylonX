import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice.js';
import placesReducer from './placesSlice.js';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    places: placesReducer, // passe placeReducer, eventReducer unah methnt ekathu karanna puluwn
  },
});