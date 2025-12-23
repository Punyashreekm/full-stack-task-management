import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

const INITIAL_TASKS = [
  { id: '1', title: 'Fix Login Bug', description: 'Login page crashes on submit', status: 'pending', assignedTo: '2', createdBy: '1' },
  { id: '2', title: 'Update Dashboard', description: 'Add charts to dashboard', status: 'completed', assignedTo: '2', createdBy: '1' },
  { id: '3', title: 'Write Documentation', description: 'Document the API endpoints', status: 'pending', assignedTo: '2', createdBy: '1' },
];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : INITIAL_TASKS;
  });

  const { user } = useAuth();

  const fetchTasks = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const addTask = async (taskData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(taskData),
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks(prev => [...prev, newTask]);
      }
    } catch (error) {
      console.error('Failed to add task', error);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prev => prev.map(task => task._id === id ? updatedTask : task));
      }
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setTasks(prev => prev.filter(task => task._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
