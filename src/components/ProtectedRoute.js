// src/components/ProtectedRoute.js

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { message } from 'antd';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    message.error('У вас нет доступа к этой странице');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
