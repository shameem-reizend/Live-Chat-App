// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('accessToken');

  if(token){

    const decodeAccessToken = () => {
      try {
        const decoded = jwtDecode(token);
        return decoded
      } catch (error) {
        console.log(error)
      }
    }
    const decodedToken = decodeAccessToken();

    if(decodedToken){
      return <>{children}</>;
    } else {
      return <Navigate to="/login" replace />;
    }
  } else {
    return <Navigate to="/login" replace />;
  }


  // if (!token) {
  //   return <Navigate to="/login" replace />;
  // }

  // return <>{children}</>;
};

export default ProtectedRoute;
