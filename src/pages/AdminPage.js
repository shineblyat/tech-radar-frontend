// src/pages/AdminPage.js

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Spin,
} from 'antd';
import { axiosAuth } from '../utils/axiosInstances'; // Исправленный импорт на axiosAuth
// Удалён импорт axiosTechnologyInstance, так как он больше не существует
// import axiosTechnologyInstance from '../utils/axiosTechnologyInstance'; // Удалите этот импорт
// import { useNavigate } from 'react-router-dom'; // Удалён, так как не используется

const { Option } = Select;

const AdminPage = () => {
  // Удалён navigate, так как он не используется
  // const navigate = useNavigate();

  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTech, setEditingTech] = useState(null);
  const [form] = Form.useForm();
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    setLoading(true);
    try {
      // Используем axiosAuth для запросов к административным эндпоинтам
      const response = await axiosAuth.get('/admin/technology'); // Предполагается, что эндпоинт /admin/technology
      setTechnologies(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке технологий:', error);
      message.error('Ошибка при загрузке технологий');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (tech = null) => {
    setEditingTech(tech);
    setIsModalVisible(true);
    if (tech) {
      form.setFieldsValue(tech);
    } else {
      form.resetFields();
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setModalLoading(true);
      if (editingTech) {
        // Редактирование технологии
        const response = await axiosAuth.put(`/admin/${editingTech.id}`, values);
        if (response.status === 200) {
          message.success('Технология обновлена');
        }
      } else {
        // Добавление новой технологии
        const response = await axiosAuth.post('/admin', values);
        if (response.status === 200 || response.status === 201) {
          message.success('Технология добавлена');
        }
      }
      fetchTechnologies();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Ошибка при сохранении технологии:', error);
      if (error.response && error.response.data && error.response.data.message) {
        message.error(`Ошибка: ${error.response.data.message}`);
      } else {
        message.error('Ошибка при сохранении технологии');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (techId) => {
    try {
      const response = await axiosAuth.delete(`/admin/${techId}`);
      if (response.status === 200 || response.status === 204) {
        message.success('Технология удалена');
        fetchTechnologies();
      }
    } catch (error) {
      console.error('Ошибка при удалении технологии:', error);
      if (error.response && error.response.data && error.response.data.message) {
        message.error(`Ошибка: ${error.response.data.message}`);
      } else {
        message.error('Ошибка при удалении технологии');
      }
    }
  };

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ссылка',
      dataIndex: 'link',
      key: 'link',
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: 'Версия',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: 'Ранг',
      dataIndex: 'rang',
      key: 'rang',
    },
    {
      title: 'Тип технологии',
      dataIndex: 'technologyType',
      key: 'technologyType',
      render: (text) => {
        // Преобразуем значение в читаемый формат
        switch (text) {
          case 'FRAMEWORK':
            return 'Фреймворк';
          case 'LANGUAGE':
            return 'Язык программирования';
          case 'INFRASTRUCTURE':
            return 'Инфраструктура';
          case 'DATA_MANAGEMENT':
            return 'Управление данными';
          default:
            return text;
        }
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>
            Редактировать
          </Button>
          <Popconfirm
            title="Вы уверены, что хотите удалить эту технологию?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="link" danger>
              Удалить
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Управление технологиями
      </h2>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: '20px' }}
      >
        Добавить технологию
      </Button>
      {loading ? (
        <Spin tip="Загрузка..." />
      ) : (
        <Table dataSource={technologies} columns={columns} rowKey="id" />
      )}
      <Modal
        title={editingTech ? 'Редактировать технологию' : 'Добавить технологию'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={modalLoading}
        okText={editingTech ? 'Сохранить' : 'Добавить'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: 'Введите название технологии' }]}
          >
            <Input placeholder="Название" />
          </Form.Item>
          <Form.Item
            label="Ссылка"
            name="link"
            rules={[
              { required: true, message: 'Введите ссылку на технологию' },
              { type: 'url', message: 'Введите корректный URL' },
            ]}
          >
            <Input placeholder="Ссылка" />
          </Form.Item>
          <Form.Item
            label="Версия"
            name="version"
            rules={[{ required: true, message: 'Введите версию технологии' }]}
          >
            <Input placeholder="Версия" />
          </Form.Item>
          <Form.Item
            label="Ранг"
            name="rang"
            rules={[{ required: true, message: 'Выберите ранг' }]}
          >
            <Select placeholder="Выберите ранг">
              <Option value="ADOPT">ADOPT</Option>
              <Option value="TRIAL">TRIAL</Option>
              <Option value="ASSESS">ASSESS</Option>
              <Option value="HOLD">HOLD</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Тип технологии"
            name="technologyType"
            rules={[{ required: true, message: 'Выберите тип технологии' }]}
          >
            <Select placeholder="Выберите тип технологии">
              <Option value="FRAMEWORK">Фреймворк</Option>
              <Option value="LANGUAGE">Язык программирования</Option>
              <Option value="INFRASTRUCTURE">Инфраструктура</Option>
              <Option value="DATA_MANAGEMENT">Управление данными</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;
