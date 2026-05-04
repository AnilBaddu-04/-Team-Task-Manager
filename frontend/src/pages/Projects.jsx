import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Projects({ user }) {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    fetchProjects();
    if (user.role === 'Admin') {
      fetchUsers();
    }
  }, [user.role]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/projects', { name, description, memberIds: selectedMembers });
      setShowModal(false);
      setName('');
      setDescription('');
      setSelectedMembers([]);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        {user.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Project
          </button>
        )}
      </div>

      <div className="dashboard-grid">
        {projects.length === 0 ? (
          <div className="card-subtitle">No projects found.</div>
        ) : (
          projects.map(p => (
            <div key={p.id} className="card">
              <h3 className="card-title">{p.name}</h3>
              <p className="card-subtitle">{p.description}</p>
              {p.Users && (
                <div style={{marginTop: '1rem'}}>
                  <span style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>Members: {p.Users.length}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="card-title" style={{marginBottom: '1.5rem'}}>Create New Project</h2>
            <form onSubmit={handleCreateProject} className="flex-col">
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Assign Members</label>
                <select 
                  multiple 
                  className="form-select" 
                  value={selectedMembers} 
                  onChange={e => {
                    const options = [...e.target.selectedOptions];
                    const values = options.map(option => option.value);
                    setSelectedMembers(values);
                  }}
                  style={{height: '100px'}}
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
                  ))}
                </select>
                <small style={{color: 'var(--text-muted)'}}>Hold Ctrl/Cmd to select multiple</small>
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
