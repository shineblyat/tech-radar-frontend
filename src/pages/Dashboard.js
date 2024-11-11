// src/pages/Dashboard.js

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Typography, Layout } from 'antd';
import { logout } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: '#fff', padding: '0 20px' }}>
        <div style={{ float: 'right' }}>
          <Button type="primary" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
        <Title level={3}>Добро пожаловать в Dashboard</Title>
      </Header>
      <Content style={{ margin: '20px' }}>
        <Typography>
          <Title level={4}>Привет, {user?.username}!</Title>
          <Paragraph>
            Это ваша панель управления. Здесь вы можете:
          </Paragraph>
          <ul>
            <li>Просматривать и голосовать за технологии на Tech Radar.</li>
            <li>Управлять своими предпочтениями.</li>
            {user?.role === 'ADMIN' && (
              <li>Управлять технологиями в Админ-Панели.</li>
            )}
          </ul>
          <Button type="primary" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
            Перейти на главную страницу
          </Button>
        </Typography>
      </Content>
      <Footer style={{ textAlign: 'center' }}>© 2024 </Footer>
    </Layout>
  );
};

export default Dashboard;
