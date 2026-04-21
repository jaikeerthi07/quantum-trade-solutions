import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import DashboardLayout from './layouts/DashboardLayout';

const API_BASE = '/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('registry'); // 'registry' or 'onboarding'
  
  // Persistence: Hydrate state from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setActiveView('registry');
    localStorage.setItem('isAuth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuth');
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={handleLogout} activeView={activeView} setActiveView={setActiveView}>
                <DashboardHome activeView={activeView} setActiveView={setActiveView} />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
