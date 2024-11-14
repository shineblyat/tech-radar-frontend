// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  username: '',
  password: '', // **Не рекомендуется хранить пароль**
  role: '', // 'admin' или 'user'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.password = action.payload.password; // **Не рекомендуется**
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = '';
      state.password = '';
      state.role = '';
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
