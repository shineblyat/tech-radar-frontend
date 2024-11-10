// src/components/Header.js

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from '../store/userSlice';
import './Header.css'; // Импортируем стили для Header

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Выйти',
          onClick: handleLogout,
        },
      ]}
    />
  );

  const menuItems = [
    {
      key: 'vote',
      label: 'Голосование',
      onClick: () => navigate('/vote'),
    },
  ];

  if (isAuthenticated && user.role === 'ADMIN') {
    menuItems.push({
      key: 'admin',
      label: 'Админ панель',
      onClick: () => navigate('/admin'),
    });
  }

  return (
    <AntHeader className="header">
      <div className="logo" onClick={() => navigate('/')}>
        Tech Radar
      </div>
      <Menu
        mode="horizontal"
        selectable={false}
        className="menu"
        items={menuItems}
      />
      <div className="user-section">
        {isAuthenticated ? (
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div className="user-info">
              <Avatar icon={<UserOutlined />} />
              <span className="user-name">{user.name}</span>
            </div>
          </Dropdown>
        ) : (
          <div>
            <Button
              type="primary"
              onClick={() => navigate('/login')}
              style={{ marginRight: '10px' }}
            >
              Войти
            </Button>
            <Button onClick={() => navigate('/register')}>Регистрация</Button>
          </div>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;
