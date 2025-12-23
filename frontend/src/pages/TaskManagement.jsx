import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Save, X } from 'lucide-react';

const TaskManagement = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('pending');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          if (data.length > 0 && !assignedTo) {
            setAssignedTo(data[0]._id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };
    fetchUsers();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAssignedTo(users.length > 0 ? users[0]._id : '');
    setStatus('pending');
    setIsEditing(false);
    setCurrentTask(null);
  };

  const handleEditClick = (task) => {
    setIsEditing(true);
    setCurrentTask(task);
    setTitle(task.title);
    setDescription(task.description);
    // Handle populated assignedTo object or string ID
    const assignedId = task.assignedTo?._id || task.assignedTo;
    setAssignedTo(assignedId);
    setStatus(task.status);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing && currentTask) {
      updateTask(currentTask._id, {
        title,
        description,
        assignedTo,
        status
      });
    } else {
      addTask({
        title,
        description,
        assignedTo,
        createdBy: user._id
      });
    }
    
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      deleteTask(id);
    }
  };

  // Filter tasks created by this manager
  const myTasks = tasks.filter(t => t.createdBy?._id === user._id || t.createdBy === user._id);

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Task Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Create and manage tasks for your team.</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        {/* Form Section */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isEditing ? <><Save size={20} /> Edit Task</> : <><Plus size={20} /> Create New Task</>}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="title">Task Title</label>
              <input
                type="text"
                id="title"
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Fix Homepage Bug"
              />
            </div>

            <div className="input-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                className="input-field"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Details about the task..."
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="input-group">
              <label htmlFor="assignedTo">Assign To</label>
              <select
                id="assignedTo"
                className="input-field"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
              >
                <option value="" disabled>Select a user</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>

            {isEditing && (
              <div className="input-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  className="input-field"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                {isEditing ? 'Update Task' : 'Create Task'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Managed Tasks</h2>
          
          {myTasks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myTasks.map(task => (
                <div key={task._id} style={{ 
                  padding: '1rem', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--bg-body)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{task.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      Assigned to: {task.assignedTo?.name || 'Unknown'} • Status: {task.status}
                    </p>
                  </div>
                  
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button 
                      onClick={() => updateTask(task._id, { status: task.status === 'completed' ? 'pending' : 'completed' })}
                      className={`btn ${task.status === 'completed' ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                    >
                      {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                    </button>
                    <button onClick={() => handleEditClick(task)} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(task._id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              No tasks created yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
