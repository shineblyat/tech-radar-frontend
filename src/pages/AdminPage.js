// src/pages/AdminPage.js

import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import axiosInstance from '../utils/axiosInstance';

const { Option } = Select;

const AdminPage = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTech, setEditingTech] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    try {
      const response = await axiosInstance.get('/technology');
      setTechnologies(response.data);
    } catch (error) {
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
      if (editingTech) {
        // Редактирование
        await axiosInstance.put(`/admin/${editingTech.id}`, values);
        message.success('Технология обновлена');
      } else {
        // Добавление
        await axiosInstance.post('/admin', values);
        message.success('Технология добавлена');
      }
      fetchTechnologies();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Ошибка при сохранении технологии');
    }
  };

  const handleDelete = async (techId) => {
    try {
      await axiosInstance.delete(`/admin/${techId}`);
      message.success('Технология удалена');
      fetchTechnologies();
    } catch (error) {
      message.error('Ошибка при удалении технологии');
    }
  };

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
      title: 'Действия',
      key: 'actions',
      render: (text, record) => (
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
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Управление технологиями</h2>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: '20px' }}>
        Добавить технологию
      </Button>
      <Table dataSource={technologies} columns={columns} rowKey="id" loading={loading} />
      <Modal
        title={editingTech ? 'Редактировать технологию' : 'Добавить технологию'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: 'Введите название технологии' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ссылка"
            name="link"
            rules={[{ required: true, message: 'Введите ссылку' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Версия"
            name="version"
            rules={[{ required: true, message: 'Введите версию' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ранг"
            name="rang"
            rules={[{ required: true, message: 'Выберите ранг' }]}
          >
            <Select>
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
            <Select>
              <Option value="FRAMEWORK">FRAMEWORK</Option>
              <Option value="LANGUAGE">LANGUAGE</Option>
              <Option value="INFRASTRUCTURE">INFRASTRUCTURE</Option>
              <Option value="DATA_MANAGEMENT">DATA_MANAGEMENT</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;
