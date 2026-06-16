import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice.js';
import placesReducer from './placesSlice.js';
import authReducer from './authSlice.js';
import eventsReducer from './eventsSlice.js';
import plannerReducer from './plannerSlice.js';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    places: placesReducer,
    auth: authReducer,// passe placeReducer, eventReducer unah methnt ekathu karanna puluwn
    events: eventsReducer,
    planner: plannerReducer,
  },
});