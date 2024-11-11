import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import VotingPage from './pages/VotingPage'; // Убедитесь, что VotingPage импортирован
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import { Provider } from 'react-redux';
import store from './store/store';
import { Layout } from 'antd';

const { Content, Footer } = Layout;

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Header />
          <Content style={{ padding: '20px' }}>
            <Routes>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Защищённый маршрут для Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Защищённый маршрут только для ADMIN */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRoles="ADMIN">
                    <AdminPage />
                  </ProtectedRoute>
                }
              />

              {/* Защищённый маршрут для голосования */}
              <Route
                path="/vote"
                element={
                  <ProtectedRoute>
                    <VotingPage />
                  </ProtectedRoute>
                }
              />

              {/* Главная страница */}
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: 'center' }}>© 2024 TechRadar</Footer>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;
