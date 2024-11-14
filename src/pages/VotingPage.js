// src/pages/VotingPage.js

import React, { useEffect, useState } from 'react';
import { Table, Button, message, Spin, Tabs } from 'antd';
import { axiosAuth, axiosVoting } from '../utils/axiosInstances'; // Изменили импорт на axiosTech и axiosVoting
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './VotingPage.css'; // Импортируем стили для VotingPage

const { TabPane } = Tabs;

const VotingPage = () => {
  const [technologies, setTechnologies] = useState([]);
  const [userVotes, setUserVotes] = useState([]);
  const [loading, setLoading] = useState(true);
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
        // Заменили экземпляры Axios на axiosTech и axiosVoting
        const [techResponse, votesResponse] = await Promise.all([
          axiosAuth.get('/radar'), // GET-запрос для получения технологий
          axiosVoting.get('/vote'),       // GET-запрос для получения голосов пользователя
        ]);

        // Предположим, что данные возвращаются в формате { data: [...] }
        setTechnologies(techResponse.data);
        setUserVotes(votesResponse.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        message.error('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  const handleVote = async (techId) => {
    try {
      // Используем axiosVoting для голосования
      const response = await axiosVoting.post('/vote', { technologyId: techId });

      // Предположим, что успешный ответ содержит данные голоса
      if (response.status === 200 || response.status === 201) {
        message.success('Ваш голос учтен');
        setUserVotes((prevVotes) => [...prevVotes, response.data]);
      }
    } catch (error) {
      console.error('Ошибка при голосовании:', error);
      if (error.response && error.response.status === 400) {
        message.error('Вы уже голосовали за эту технологию');
      } else {
        message.error('Ошибка при голосовании');
      }
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    );
  }

  // Получаем ID технологий, за которые пользователь уже проголосовал
  const votedTechIds = userVotes.map((vote) => vote.technologyId);

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
      title: 'Кольцо',
      dataIndex: 'rang',
      key: 'rang',
    },
    {
      title: 'Действие',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" onClick={() => handleVote(record.id)}>
          Проголосовать
        </Button>
      ),
    },
  ];

  // Определяем колонки для таблицы голосов пользователя
  const userVotesColumns = [
    {
      title: 'Название',
      dataIndex: ['technology', 'name'], // Предположим, что голос содержит объект technology
      key: 'name',
    },
    {
      title: 'Категория',
      dataIndex: ['technology', 'technologyType'],
      key: 'technologyType',
    },
    {
      title: 'Кольцо',
      dataIndex: ['technology', 'rang'],
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
    </div>
  );
};

export default VotingPage;
