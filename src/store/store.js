// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import userReducer, { fetchUserData } from './userSlice';
import { axiosAuth } from '../utils/axiosInstances'; // Исправленный импорт

const store = configureStore({
  reducer: {
    user: userReducer,
    // Добавьте другие редьюсеры здесь, если необходимо
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(/* другие middleware, если нужно */),
});

// Восстановление состояния пользователя при загрузке приложения
const token = localStorage.getItem('authToken');
if (token) {
  // Добавьте токен в axiosAuth, если он еще не добавлен
  axiosAuth.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // Запросите данные пользователя
  store.dispatch(fetchUserData());
}

export default store;
