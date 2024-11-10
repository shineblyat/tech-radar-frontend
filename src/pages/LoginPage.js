// src/pages/LoginPage.js

import React from 'react';
import { Form, Input, Button, Spin, message, Row, Col } from 'antd';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/userSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Отправляем POST-запрос на эндпоинт /auth/login с данными формы
      const response = await axiosInstance.post('http://localhost:8080/login', {
        name: values.name,
        password: values.password,
      });

      if (response.status === 200) {
        const { token, user } = response.data; // Предполагается, что сервер возвращает токен и информацию о пользователе

        // Диспетчеризуем экшен для обновления состояния пользователя в Redux
        dispatch(loginSuccess({ user }));

        // Сохраняем токен в localStorage для дальнейшего использования
        localStorage.setItem('authToken', token);

        message.success('Вход выполнен успешно!');
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        message.error(`Ошибка при входе: ${error.response.data.message}`);
      } else {
        message.error('Ошибка при входе');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
      <Col xs={22} sm={16} md={12} lg={8}>
        <Form
          onFinish={onFinish}
          layout="vertical"
          style={{
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ textAlign: 'center' }}>Вход</h2>
          <Form.Item
            label="Имя пользователя"
            name="name"
            rules={[{ required: true, message: 'Введите имя пользователя' }]}
          >
            <Input placeholder="Имя пользователя" />
          </Form.Item>
          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              { required: true, message: 'Введите пароль' },
              { min: 6, message: 'Пароль должен содержать минимум 6 символов' },
            ]}
          >
            <Input.Password placeholder="Пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading}>
              {loading ? <Spin /> : 'Войти'}
            </Button>
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            Нет аккаунта?{' '}
            <Button type="link" onClick={() => navigate('/register')}>
              Зарегистрируйтесь
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default LoginPage;
