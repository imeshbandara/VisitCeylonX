import { createSlice } from '@reduxjs/toolkit';


const storedUser = localStorage.getItem('profile') 
  ? JSON.parse(localStorage.getItem('profile')) 
  : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authData: storedUser,
    loading: false,
    error: null
  },
  reducers: {
    // 1. LOGIN / SIGN-IN SUCCESS ACTION
    authLoginSuccess: (state, action) => {
      // action.payload eken ena daththa LocalStorage ekata demima
      localStorage.setItem('profile', JSON.stringify(action.payload));
      state.authData = action.payload;
      state.error = null;
    },
    
    // 2. LOGOUT ACTION
    authLogout: (state) => {
      localStorage.removeItem('profile'); // LocalStorage eka clear kirima
      state.authData = null;
      state.error = null;
    },
    
    // 3. SET AUTH ERROR
    authError: (state, action) => {
      state.error = action.payload;
    }
  }
});

// Components waladi pawichchi kirimata Actions export karaganima
export const { authLoginSuccess, authLogout, authError } = authSlice.actions;
export default authSlice.reducer;