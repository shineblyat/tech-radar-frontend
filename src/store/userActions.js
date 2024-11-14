// src/store/userActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosAuth } from '../utils/axiosInstances'; // Исправленный импорт

export const register = createAsyncThunk(
  'user/register',
  async ({ id, name, password, role }, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.post('/registration', {
        id,
        name,
        password,
        role,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: error.message });
    }
  }
);
