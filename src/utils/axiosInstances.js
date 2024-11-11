// src/utils/axiosInstances.js
import axios from 'axios';

/**
 * Функция для создания экземпляра Axios с заданными параметрами.
 * @param {string} baseURL - Базовый URL для Axios.
 * @returns {AxiosInstance} - Настроенный экземпляр Axios.
 */
const createAxiosInstance = (baseURL) => {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Исправленные экземпляры для ясности
export const axiosAuth = createAxiosInstance('http://localhost:8080'); // Вход и регистрация
export const axiosTech = createAxiosInstance('http://localhost:8001'); // Технологии
export const axiosVoting = createAxiosInstance('http://localhost:8002'); // Голосование
