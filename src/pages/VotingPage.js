// src/pages/VotingPage.js

import React, { useEffect, useState } from 'react';
import { Table, Button, message, Spin, Tabs, Modal, InputNumber } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './VotingPage.css'; // Импортируем стили для VotingPage

const { TabPane } = Tabs;

const VotingPage = () => {
  const [technologies, setTechnologies] = useState([]);
  const [userVotes, setUserVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTech, setCurrentTech] = useState(null);
  const [newRang, setNewRang] = useState(null);
  
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      message.error('Для голосования необходимо войти в систему');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/radar'); // Получение технологий с указанного URL
        setTechnologies(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        message.error('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  const handleVote = (tech) => {
    // Проверяем, голосовал ли пользователь уже за эту технологию
    const hasVoted = userVotes.find((vote) => vote.id === tech.id);
    if (hasVoted) {
      message.error('Вы уже голосовали за эту технологию');
      return;
    }

    // Открываем модальное окно для изменения ранга
    setCurrentTech(tech);
    setNewRang(tech.rang); // Инициализируем текущее значение ранга
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (newRang === null || newRang === undefined) {
      message.error('Пожалуйста, введите новый ранг');
      return;
    }

    // Обновляем ранг технологии в списке
    setTechnologies((prevTechnologies) =>
      prevTechnologies.map((tech) =>
        tech.id === currentTech.id ? { ...tech, rang: newRang } : tech
      )
    );

    // Добавляем голос в список голосов пользователя
    setUserVotes((prevVotes) => [...prevVotes, { ...currentTech, voteDate: new Date().toISOString() }]);

    message.success('Ваш голос учтен');
    setIsModalVisible(false);
    setCurrentTech(null);
    setNewRang(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentTech(null);
    setNewRang(null);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    );
  }

  // Получаем ID технологий, за которые пользователь уже проголосовал
  const votedTechIds = userVotes.map((vote) => vote.id);

  // Фильтруем доступные для голосования технологии
  const availableTechnologies = technologies.filter(
    (tech) => !votedTechIds.includes(tech.id)
  );

  // Определяем колонки для таблицы доступных технологий
  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Категория',
      dataIndex: 'technologyType',
      key: 'technologyType',
    },
    {
      title: 'Кольцо (Rang)',
      dataIndex: 'rang',
      key: 'rang',
    },
    {
      title: 'Действие',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" onClick={() => handleVote(record)}>
          Проголосовать
        </Button>
      ),
    },
  ];

  // Определяем колонки для таблицы голосов пользователя
  const userVotesColumns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Категория',
      dataIndex: 'technologyType',
      key: 'technologyType',
    },
    {
      title: 'Кольцо (Rang)',
      dataIndex: 'rang',
      key: 'rang',
    },
    {
      title: 'Дата голосования',
      dataIndex: 'voteDate',
      key: 'voteDate',
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <div className="voting-page">
      <h2 className="page-title">Страница голосования</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Доступные для голосования" key="1">
          <Table
            dataSource={availableTechnologies}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
            locale={{
              emptyText: 'Нет доступных технологий для голосования',
            }}
          />
        </TabPane>
        <TabPane tab="Мои голоса" key="2">
          <Table
            dataSource={userVotes}
            columns={userVotesColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
            locale={{
              emptyText: 'Вы еще не проголосовали за технологии',
            }}
          />
        </TabPane>
      </Tabs>

      {/* Модальное окно для изменения ранга при голосовании */}
      <Modal
        title={`Голосование за ${currentTech ? currentTech.name : ''}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Проголосовать"
      >
        <p>Вы можете изменить ранг технологии перед голосованием.</p>
        <p>Текущий ранг: {currentTech ? currentTech.rang : ''}</p>
        <label htmlFor="newRang">Новый ранг:</label>
        <InputNumber
          id="newRang"
          min={1}
          max={10}
          value={newRang}
          onChange={(value) => setNewRang(value)}
          style={{ width: '100%' }}
        />
      </Modal>
    </div>
  );
};

export default VotingPage;
