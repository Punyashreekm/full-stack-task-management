import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, updateTask, deleteTask } = useTasks();

  const assignedTasks = tasks.filter(task => task.assignedTo?._id === user._id || task.assignedTo === user._id);
  const createdTasks = tasks.filter(task => task.createdBy?._id === user._id || task.createdBy === user._id);

  const handleStatusChange = (id, status) => {
    updateTask(id, { status });
  };

  // Managers can edit/delete tasks they created
  const handleEdit = (task) => {
    console.log('Edit task', task);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user.name}</p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* Assigned Tasks */}
        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            My Assigned Tasks
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({assignedTasks.length})</span>
          </h2>
          
          {assignedTasks.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {assignedTasks.map(task => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onStatusChange={handleStatusChange}
                  showActions={false} // Employees usually just update status
                />
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <p>No tasks assigned to you yet.</p>
            </div>
          )}
        </section>

        {/* Created Tasks (Manager View) */}
        {user.role === 'manager' && (
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Tasks I Created
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({createdTasks.length})</span>
            </h2>
            
            {createdTasks.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {createdTasks.map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    showActions={true} // Managers can delete their created tasks
                    onEdit={() => {}} // Placeholder
                  />
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <p>You haven't created any tasks yet.</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
