import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './auth/LoginForm';

import RegistrationForm from './auth/RegisterForm';
import { Home } from './components/Home';
import ProtectedRoutes from './protected/ProtectedRoutes';

export const App: React.FC = () => {


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </Router>
  );
};
