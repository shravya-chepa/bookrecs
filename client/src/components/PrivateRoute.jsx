import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken'); // Check for authentication token
  return token ? children : <Navigate to="/login" />; // Redirect to login if not authenticated
};

export default PrivateRoute;
