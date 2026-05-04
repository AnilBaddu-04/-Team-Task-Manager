import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Tasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  useEffect(() => {
    fetchTasks();
    if (user.role === 'Admin') {
      fetchProjects();
      fetchUsers();
    }
  }, [user.role]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/projects');
      setProjects(res.data);
      if (res.data.length > 0) setProjectId(res.data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/users');
      setUsers(res.data);
      if (res.data.length > 0) setAssigneeId(res.data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/tasks', { title, description, status, dueDate, projectId, assigneeId });
      setShowModal(false);
      fetchTasks();
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      await axios.put(`/tasks/${id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'Completed') return 'badge-completed';
    if (status === 'In Progress') return 'badge-progress';
    return 'badge-pending';
  };

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Tasks</h1>
        {user.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Task
          </button>
        )}
      </div>

      <div className="dashboard-grid">
        {tasks.length === 0 ? (
          <div className="card-subtitle">No tasks found.</div>
        ) : (
          tasks.map(t => (
            <div key={t.id} className="card">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <h3 className="card-title">{t.title}</h3>
                <span className={`badge ${getStatusBadgeClass(t.status)}`}>{t.status}</span>
              </div>
              <p className="card-subtitle mb-4">{t.description}</p>
              
              <div style={{fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>
                <div>Project: {t.Project?.name || 'N/A'}</div>
                <div>Assignee: {t.Assignee?.username || 'N/A'}</div>
                <div>Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No date'}</div>
              </div>

              <select 
                className="form-select" 
                style={{padding: '0.5rem', fontSize: '0.875rem'}}
                value={t.status}
                onChange={(e) => updateTaskStatus(t.id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="card-title" style={{marginBottom: '1.5rem'}}>Create New Task</h2>
            <form onSubmit={handleCreateTask} className="flex-col">
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)} rows="2" />
              </div>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Project</label>
                  <select className="form-select" value={projectId} onChange={e => setProjectId(e.target.value)} required>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assign To</label>
                  <select className="form-select" value={assigneeId} onChange={e => setAssigneeId(e.target.value)} required>
                    {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input type="date" className="form-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                </div>
              </div>
              
              <div className="gap-2" style={{justifyContent: 'flex-end', marginTop: '1rem'}}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
