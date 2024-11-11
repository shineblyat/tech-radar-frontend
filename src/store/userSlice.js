// src/store/userSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosAuth } from '../utils/axiosInstances'; // Исправленный импорт

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Асинхронное действие для загрузки данных пользователя
export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.get('/admin/me'); // Предполагается, что эндпоинт /admin/me
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user; // { username, role }
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Ошибка при загрузке данных пользователя';
      });
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
