// src/pages/RegisterPage.js

import React from 'react';
import { Form, Input, Button, Select, Spin, message, Row, Col } from 'antd';
import { axiosAuth } from '../utils/axiosInstances';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Эндпоинт регистрации - /registration
      const response = await axiosAuth.post('/registration', values);
      if (response.status === 200 || response.status === 201) {
        message.success('Регистрация прошла успешно!');
        navigate('/login');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          message.error(`Ошибка при регистрации: ${error.response.data.message}`);
        } else if (error.response.status === 401) {
          message.error('Ошибка авторизации: Недопустимые данные');
        } else {
          message.error('Ошибка при регистрации');
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
          <h2 style={{ textAlign: 'center' }}>Регистрация</h2>
          <Form.Item
            label="Имя пользователя"
            name="name" // Изменено с 'username' на 'name'
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
          <Form.Item
            label="Роль"
            name="role"
            rules={[{ required: true, message: 'Выберите роль' }]}
          >
            <Select placeholder="Выберите роль">
              <Option value="USER">USER</Option>
              <Option value="ADMIN">ADMIN</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading}>
              {loading ? <Spin /> : 'Зарегистрироваться'}
            </Button>
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            Уже есть аккаунт?{' '}
            <Button type="link" onClick={() => navigate('/login')}>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default RegisterPage;
