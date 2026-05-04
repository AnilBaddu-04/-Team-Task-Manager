import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';

// Setup axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  if (loading) return <div className="container" style={{paddingTop: '2rem'}}>Loading...</div>;

  return (
    <Router>
      <div className="app-layout">
        {user && (
          <nav className="navbar">
            <div className="container">
              <div className="navbar-brand">
                🚀 TeamTaskManager
              </div>
              <div className="navbar-links">
                <Link to="/" className="nav-link">Dashboard</Link>
                <Link to="/projects" className="nav-link">Projects</Link>
                <Link to="/tasks" className="nav-link">Tasks</Link>
                <button onClick={handleLogout} className="btn btn-secondary" style={{marginLeft: '1rem'}}>
                  Logout ({user.username})
                </button>
              </div>
            </div>
          </nav>
        )}
        
        <main style={{flex: 1}}>
          <Routes>
            <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup onLogin={handleLogin} /> : <Navigate to="/" />} />
            
            <Route path="/" element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            } />
            
            <Route path="/projects" element={
              <ProtectedRoute user={user}>
                <Projects user={user} />
              </ProtectedRoute>
            } />
            
            <Route path="/tasks" element={
              <ProtectedRoute user={user}>
                <Tasks user={user} />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
