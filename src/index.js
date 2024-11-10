// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'antd/dist/reset.css'; // Для Ant Design версии 5
import './styles.css'; // Импорт глобальных стилей

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
