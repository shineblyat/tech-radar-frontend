// src/pages/LoginPage.js

import React from 'react';
import { Form, Input, Button, Spin, message, Row, Col } from 'antd';
import { axiosAuth } from '../utils/axiosInstances'; // Используем axiosAuth для запросов
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
      // Используем метод POST и отправляем данные в теле запроса
      const response = await axiosAuth.post('/authorization', {
        name: values.name, // Используем 'name', как в базе данных
        password: values.password,
      });

      if (response.status === 200) {
        const user = response.data; // Предполагаем, что сервер возвращает объект пользователя напрямую

        // Диспетчеризуем экшен для обновления состояния пользователя в Redux
        dispatch(loginSuccess({ user }));

        message.success('Вход выполнен успешно!');
        navigate('/'); // Перенаправление на главную страницу после успешного входа
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          message.error('Ошибка авторизации: Неверные данные');
        } else if (error.response.data && error.response.data.message) {
          message.error(`Ошибка при входе: ${error.response.data.message}`);
        } else {
          message.error('Ошибка при входе');
        }
      } else {
        message.error('Нет соединения с сервером');
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
            name="name" // Используем 'name' как в таблице базы данных
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
