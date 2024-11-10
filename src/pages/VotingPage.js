// src/pages/VotingPage.js

import React, { useEffect, useState } from 'react';
import { Table, Button, message, Spin, Tabs } from 'antd';
import axiosInstance from '../utils/axiosInstance';
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

    const fetchTechnologies = async () => {
      try {
        const [techResponse, votesResponse] = await Promise.all([
          axiosInstance.get('/technology'),
          axiosInstance.get('/vote'),
        ]);
        setTechnologies(techResponse.data);
        setUserVotes(votesResponse.data);
      } catch (error) {
        message.error('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, [isAuthenticated, navigate]);

  const handleVote = async (techId) => {
    try {
      const response = await axiosInstance.post('/vote', { technologyId: techId });
      if (response.status === 200) {
        message.success('Ваш голос учтен');
        // Обновляем список голосов пользователя
        setUserVotes((prevVotes) => [...prevVotes, response.data]);
      }
    } catch (error) {
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
        <Spin />
      </div>
    );
  }

  // Фильтруем технологии, за которые пользователь уже проголосовал
  const votedTechIds = userVotes.map((vote) => vote.technologyId);
  const availableTechnologies = technologies.filter(
    (tech) => !votedTechIds.includes(tech.id)
  );

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
      title: 'Ранг',
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

  const userVotesColumns = [
    {
      title: 'Название',
      dataIndex: ['technology', 'name'],
      key: 'name',
    },
    {
      title: 'Категория',
      dataIndex: ['technology', 'technologyType'],
      key: 'technologyType',
    },
    {
      title: 'Ранг',
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
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Страница голосования</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Доступные для голосования" key="1">
          <Table
            dataSource={availableTechnologies}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
          />
        </TabPane>
        <TabPane tab="Мои голоса" key="2">
          <Table
            dataSource={userVotes}
            columns={userVotesColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default VotingPage;
