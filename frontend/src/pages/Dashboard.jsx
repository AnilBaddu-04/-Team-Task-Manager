import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ user }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) return <div className="container mt-4">Loading stats...</div>;

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="card-subtitle mt-4">Welcome back, {user.username}! Here's your overview.</p>
        </div>
        {user.role === 'Admin' && <span className="badge badge-admin">Admin Privileges Active</span>}
      </div>

      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{background: 'linear-gradient(135deg, #fcd34d, #f59e0b)', WebkitBackgroundClip: 'text'}}>{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{background: 'linear-gradient(135deg, #a855f7, #6366f1)', WebkitBackgroundClip: 'text'}}>{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{background: 'linear-gradient(135deg, #34d399, #10b981)', WebkitBackgroundClip: 'text'}}>{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {stats.overdue > 0 && (
        <div className="card" style={{borderColor: 'var(--danger-color)', backgroundColor: 'rgba(239, 68, 68, 0.05)'}}>
          <h3 style={{color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            ⚠️ Attention Required
          </h3>
          <p className="mt-4">You have {stats.overdue} overdue task(s). Please review your Tasks panel.</p>
        </div>
      )}
    </div>
  );
}
