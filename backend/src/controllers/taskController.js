const Task = require('../models/Task');
const Log = require('../models/Log');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private/Manager
const createTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;

  const task = await Task.create({
    title,
    description,
    assignedTo,
    createdBy: req.user._id,
  });

  // Log activity
  await Log.create({
    action: 'CREATE_TASK',
    taskId: task._id,
    performedBy: req.user._id,
    details: `Task "${title}" created and assigned to ${assignedTo}`,
  });

  res.status(201).json(task);
};

// @desc    Get all tasks (filtered by role)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  let tasks;

  if (req.user.role === 'manager') {
    // Manager sees tasks they created OR all tasks? 
    // Prompt says: "A list of tasks created by the user (if they are a manager)."
    // But also "A list of tasks assigned to the logged-in user."
    // So manager might see both.
    // Let's return tasks where createdBy == user OR assignedTo == user
    tasks = await Task.find({
      $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }],
    }).populate('assignedTo', 'name email').populate('createdBy', 'name email');
  } else {
    // Employee sees only assigned tasks
    tasks = await Task.find({ assignedTo: req.user._id })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
  }

  res.json(tasks);
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  // Check permissions
  if (req.user.role !== 'manager' && task.assignedTo.toString() !== req.user._id.toString()) {
    res.status(403).json({ message: 'Not authorized to update this task' });
    return;
  }

  // If employee, can only update status
  if (req.user.role !== 'manager') {
    if (req.body.title || req.body.description || req.body.assignedTo) {
      res.status(403).json({ message: 'Employees can only update task status' });
      return;
    }
    task.status = req.body.status || task.status;
  } else {
    // Manager can update everything
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.assignedTo = req.body.assignedTo || task.assignedTo;
    task.status = req.body.status || task.status;
  }

  const updatedTask = await task.save();

  // Log activity
  await Log.create({
    action: 'UPDATE_TASK',
    taskId: task._id,
    performedBy: req.user._id,
    details: `Task "${task.title}" updated. Status: ${task.status}`,
  });

  res.json(updatedTask);
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Manager
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  // Only manager who created it (or any manager?) can delete?
  // Let's say any manager for simplicity, or strictly the creator.
  // Prompt says "Manager: Can create, assign, and edit tasks". Usually implies delete too.
  
  if (req.user.role !== 'manager') {
    res.status(403).json({ message: 'Not authorized to delete tasks' });
    return;
  }

  await task.deleteOne();

  // Log activity
  await Log.create({
    action: 'DELETE_TASK',
    taskId: req.params.id, // ID might not point to anything now, but good for record
    performedBy: req.user._id,
    details: `Task "${task.title}" deleted`,
  });

  res.json({ message: 'Task removed' });
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
