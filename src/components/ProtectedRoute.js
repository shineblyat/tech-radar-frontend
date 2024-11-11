// src/components/ProtectedRoute.js

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, requiredRoles }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [hasAccess, setHasAccess] = useState(true);
  const [messageShown, setMessageShown] = useState(false);

  useEffect(() => {
    // Если не аутентифицирован, не проверяем роль
    if (!isAuthenticated) {
      setHasAccess(false);
      return;
    }

    // Если не требуется конкретная роль, предоставляем доступ
    if (!requiredRoles) {
      setHasAccess(true);
      return;
    }

    // Преобразуем requiredRoles в массив, если это строка
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    // Проверяем, соответствует ли роль пользователя одной из требуемых ролей
    const roleMatch = roles.includes(user.role);

    if (!roleMatch) {
      setHasAccess(false);
    } else {
      setHasAccess(true);
    }
  }, [isAuthenticated, requiredRoles, user]);

  useEffect(() => {
    if (!hasAccess && isAuthenticated && !messageShown) {
      message.error('У вас нет доступа к этой странице');
      setMessageShown(true);
    }
  }, [hasAccess, isAuthenticated, messageShown]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

ProtectedRoute.defaultProps = {
  requiredRoles: null,
};

export default ProtectedRoute;
