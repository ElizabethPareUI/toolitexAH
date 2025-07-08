import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PankyAdminRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.userLogin);

  // Verificar si es el admin de Panky
  const isPankyAdmin = userInfo && userInfo.isAdmin && userInfo.email === 'adminpanky@test.com';

  return isPankyAdmin ? children : <Navigate to="/login" />;
};

export default PankyAdminRoute;
