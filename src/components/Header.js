// src/components/Header.js

import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, AppstoreOutlined, MenuOutlined } from '@ant-design/icons';
import { logout } from '../store/userSlice';
import './Header.css'; // Импортируем стили для Header

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  // Обработчик выхода из системы
  const handleLogout = useCallback(() => {
    dispatch(logout());
    // Удалили: localStorage.removeItem('authToken'); // Токены не используются
    navigate('/');
  }, [dispatch, navigate]);

  // Обработчик кликов по пунктам меню
  const handleMenuClick = useCallback(
    ({ key }) => {
      if (key === 'vote') {
        navigate('/vote');
      } else if (key === 'admin') {
        navigate('/admin');
      }
      setMobileMenuVisible(false); // Закрываем мобильное меню после выбора пункта
    },
    [navigate]
  );

  // Пункты основного меню с иконками
  const menuItems = [
    {
      key: 'vote',
      label: 'Голосование',
      icon: <AppstoreOutlined />,
    },
  ];

  if (isAuthenticated && user.role === 'ADMIN') {
    menuItems.push({
      key: 'admin',
      label: 'Админ панель',
      icon: <SettingOutlined />,
    });
  }

  // Меню пользователя (Dropdown)
  const userMenu = (
    <Menu
      onClick={({ key }) => {
        if (key === 'logout') {
          handleLogout();
        }
      }}
      items={[
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Выйти',
        },
      ]}
    />
  );

  // Мобильное меню
  const mobileMenu = (
    <Menu
      mode="vertical"
      selectable={false}
      className="mobile-menu"
      items={menuItems}
      onClick={handleMenuClick}
    />
  );

  return (
    <AntHeader className="header">
      {/* Логотип */}
      <div
        className="logo"
        onClick={() => navigate('/')}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter') navigate('/');
        }}
        aria-label="Перейти на главную страницу"
      >
        Tech Radar
      </div>

      {/* Иконка-бургер для мобильных устройств */}
      <div
        className="mobile-menu-icon"
        onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
        role="button"
        tabIndex={0}
        aria-label="Открыть мобильное меню"
        onKeyPress={(e) => {
          if (e.key === 'Enter') setMobileMenuVisible(!mobileMenuVisible);
        }}
      >
        <MenuOutlined />
      </div>

      {/* Основное меню для десктопных устройств */}
      <Menu
        mode="horizontal"
        selectable={false}
        className="menu"
        items={menuItems}
        onClick={handleMenuClick}
        aria-label="Основное меню"
      />

      {/* Секция пользователя */}
      <div className="user-section">
        {isAuthenticated ? (
          <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
            <div
              className="user-info"
              role="button"
              tabIndex={0}
              onClick={(e) => e.preventDefault()}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  // Дополнительные действия при нажатии Enter, если необходимо
                }
              }}
              aria-label="Меню пользователя"
            >
              <Avatar icon={<UserOutlined />} />
              <span className="user-name">{user.username}</span>
            </div>
          </Dropdown>
        ) : (
          <div className="auth-buttons">
            <Button
              type="primary"
              onClick={() => navigate('/login')}
              aria-label="Войти"
            >
              Войти
            </Button>
            <Button
              type="default"
              onClick={() => navigate('/register')}
              aria-label="Регистрация"
            >
              Регистрация
            </Button>
          </div>
        )}
      </div>

      {/* Мобильное меню */}
      {mobileMenuVisible && mobileMenu}
    </AntHeader>
  );
};

export default Header;
