import React from 'react';
import { CheckCircle, Circle, Trash2, Edit } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, onEdit, onDelete, showActions = false }) => {
  const isCompleted = task.status === 'completed';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>{task.title}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>{task.description}</p>
        </div>
        <span className={`badge ${isCompleted ? 'badge-completed' : 'badge-pending'}`}>
          {isCompleted ? 'Completed' : 'Pending'}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <button 
          onClick={() => onStatusChange(task._id, isCompleted ? 'pending' : 'completed')}
          className="btn"
          style={{ 
            padding: '0.5rem', 
            fontSize: '0.875rem', 
            color: isCompleted ? 'var(--success)' : 'var(--text-muted)',
            gap: '0.5rem'
          }}
        >
          {isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
          {isCompleted ? 'Mark Pending' : 'Mark Complete'}
        </button>

        {showActions && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => onEdit(task)} className="btn-icon" style={{ color: 'var(--primary)' }} title="Edit">
              <Edit size={18} />
            </button>
            <button onClick={() => onDelete(task._id)} className="btn-icon" style={{ color: 'var(--danger)' }} title="Delete">
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
