import React, { useState, useEffect } from 'react';
import { fetchHealth, fetchTasks, createTask, updateTask, deleteTask } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ username: 'AdvitaBhonde', role: 'DevOps Engineer' });

  // Load Health & Tasks
  const loadData = async () => {
    try {
      setLoading(true);
      const healthRes = await fetchHealth();
      setHealthStatus(healthRes);

      const tasksRes = await fetchTasks();
      if (tasksRes.success) {
        setTasks(tasksRes.data);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to Backend API. Check if service is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      fetchHealth().then(setHealthStatus);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await createTask({ title, description, priority });
      if (res.success) {
        setTasks([res.data, ...tasks]);
        setTitle('');
        setDescription('');
        setPriority('medium');
      }
    } catch (err) {
      alert('Error creating task: ' + err.message);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedStatus = !task.completed;
      const res = await updateTask(task._id, { completed: updatedStatus, status: updatedStatus ? 'completed' : 'pending' });
      if (res.success) {
        setTasks(tasks.map(t => t._id === task._id ? res.data : t));
      }
    } catch (err) {
      alert('Error updating task: ' + err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await deleteTask(id);
      if (res.success) {
        setTasks(tasks.filter(t => t._id !== id));
      }
    } catch (err) {
      alert('Error deleting task: ' + err.message);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true;
  });

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="brand">
          <span className="logo-icon">🚀</span>
          <div>
            <h1>DevOps Task Manager</h1>
            <p className="subtitle">DevSecOps & GitOps Production Architecture Demo</p>
          </div>
        </div>

        <div className="header-right">
          <div className={`status-badge ${healthStatus?.status === 'UP' ? 'online' : 'offline'}`}>
            <span className="dot"></span>
            Backend: {healthStatus?.status === 'UP' ? 'UP' : 'DOWN'}
            {healthStatus?.database?.connected && ' (DB Connected)'}
          </div>
          <div className="user-profile">
            <span className="user-avatar">👤</span>
            <div className="user-info">
              <span className="user-name">{user.username}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="main-content">
        {/* Left Column: Create Task Form */}
        <section className="card create-task-card">
          <h2>➕ Create New Task</h2>
          <form onSubmit={handleCreateTask}>
            <div className="form-group">
              <label>Task Title *</label>
              <input
                type="text"
                placeholder="e.g., Deploy ArgoCD to AWS EKS"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="3"
                placeholder="Details, requirements or deployment notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Create DevOps Task
            </button>
          </form>

          {/* System Info Banner */}
          <div className="system-banner">
            <h3>📊 Pipeline & Cluster Spec</h3>
            <ul>
              <li><strong>CI/CD:</strong> Jenkins + ArgoCD</li>
              <li><strong>Infra:</strong> Terraform AWS EKS</li>
              <li><strong>Security:</strong> OWASP, SonarQube, Trivy</li>
              <li><strong>Observability:</strong> Prometheus & Grafana</li>
            </ul>
          </div>
        </section>

        {/* Right Column: Task List & Controls */}
        <section className="card task-list-card">
          <div className="list-header">
            <h2>📋 Task List ({filteredTasks.length})</h2>

            <div className="filter-tabs">
              <button
                className={`tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`tab ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>
              <button
                className={`tab ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
          </div>

          {error && <div className="error-alert">{error}</div>}

          {loading ? (
            <div className="loading-spinner">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks found. Create one to get started!</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {filteredTasks.map((t) => (
                <div key={t._id} className={`task-item ${t.completed ? 'completed' : ''}`}>
                  <div className="task-header">
                    <span className={`priority-tag ${t.priority}`}>
                      {t.priority.toUpperCase()}
                    </span>
                    <button
                      className="btn-icon delete-btn"
                      title="Delete Task"
                      onClick={() => handleDeleteTask(t._id)}
                    >
                      🗑️
                    </button>
                  </div>

                  <h3 className="task-title">{t.title}</h3>
                  {t.description && <p className="task-desc">{t.description}</p>}

                  <div className="task-footer">
                    <span className="task-date">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      className={`btn btn-sm ${t.completed ? 'btn-success' : 'btn-outline'}`}
                      onClick={() => handleToggleComplete(t)}
                    >
                      {t.completed ? '✓ Completed' : 'Mark Done'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
