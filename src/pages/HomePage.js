// src/pages/HomePage.js

import React, { useEffect, useState } from 'react';
import { axiosTech } from '../utils/axiosInstances'; // Исправленный импорт на axiosTech
import { Spin, message } from 'antd';
import TechRadar from '../components/TechRadar';
import './HomePage.css'; // Импортируем стили для HomePage

const HomePage = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTechnologies = async () => {
    try {
      const response = await axiosTech.get('/technology'); // Используем axiosTech
      setTechnologies(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке технологий:', error);
      message.error('Ошибка при загрузке технологий');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, []);

  return (
    <div className="home-page">
      {loading ? (
        <div className="spinner-container">
          <Spin size="large" />
        </div>
      ) : (
        <TechRadar technologies={technologies} refetchTechnologies={fetchTechnologies} />
      )}
    </div>
  );
};

export default HomePage;
