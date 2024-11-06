import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import TradeFormPage from './pages/TradeFormPage';
import { AuthProvider, useAuth } from './auth/AuthContext';
import ContactPage from './pages/ContactPage';


//make sure theres a valid auth token
function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>        

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/trade-form"
            element={ <PrivateRoute> <TradeFormPage /> </PrivateRoute>}/>

          <Route path="/" element={ <PrivateRoute> <HomePage /> </PrivateRoute>}/>
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
