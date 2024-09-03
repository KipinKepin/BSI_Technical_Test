// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Checklist from './components/Checklist';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import ChecklistView from './components/ChecklistView';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (token) => {
    setIsAuthenticated(true);
    localStorage.setItem('token', token);  // Save the token in localStorage or state
  };

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route
          path='/login'
          element={isAuthenticated ? <Navigate to="/checklist" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path='/register'
          element={isAuthenticated ? <Navigate to="/checklist" /> : <Register />}
        />
        <Route
          path='/checklist'
          element={isAuthenticated ? <Checklist /> : <Navigate to="/login" />}
        />
        <Route
          path='/checklist/:checklistId'
          element={isAuthenticated ? <ChecklistView /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
