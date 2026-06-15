import { createSlice } from '@reduxjs/toolkit';

// App එක load වෙද්දීම කලින් ලොග් වෙලා හිටපු කෙනෙක්ගේ විස්තර LocalStorage එකේ තියෙනවාදැයි බැලීම
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
      // action.payload එකෙන් එන දත්ත LocalStorage එකට දැමීම
      localStorage.setItem('profile', JSON.stringify(action.payload));
      state.authData = action.payload;
      state.error = null;
    },
    
    // 2. LOGOUT ACTION
    authLogout: (state) => {
      localStorage.removeItem('profile'); // LocalStorage එක ක්ලියර් කිරීම
      state.authData = null;
      state.error = null;
    },
    
    // 3. SET AUTH ERROR (සමහර වෙලාවට ලොගින් ෆේල් වුනොත්)
    authError: (state, action) => {
      state.error = action.payload;
    }
  }
});

// Components වලදී පාවිච්චි කිරීමට Actions export කරගැනීම
export const { authLoginSuccess, authLogout, authError } = authSlice.actions;
export default authSlice.reducer;