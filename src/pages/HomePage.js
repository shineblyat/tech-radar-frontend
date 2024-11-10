// src/pages/HomePage.js

import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Spin, message } from 'antd';
import TechRadar from '../components/TechRadar';
import './HomePage.css'; // Импортируем стили для HomePage

const HomePage = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:8001/technology');
        setTechnologies(response.data);
      } catch (error) {
        message.error('Ошибка при загрузке технологий');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <Spin />
      </div>
    );
  }

  return (
    <div className="home-page">
      <TechRadar technologies={technologies} />
    </div>
  );
};

export default HomePage;
