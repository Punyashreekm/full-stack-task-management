import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, LayoutDashboard, CheckSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ 
      backgroundColor: 'var(--bg-surface)', 
      borderBottom: '1px solid var(--border)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckSquare size={24} />
          TaskFlow
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/" className={`btn ${isActive('/') ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Dashboard
            </Link>
            {user.role === 'manager' && (
              <Link to="/tasks" className={`btn ${isActive('/tasks') ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                Manage Tasks
              </Link>
            )}
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {user.name} <span style={{ opacity: 0.7 }}>({user.role})</span>
            </span>
            
            <button onClick={toggleTheme} className="btn-icon" aria-label="Toggle Theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <button onClick={handleLogout} className="btn-icon" style={{ color: 'var(--danger)' }} aria-label="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
