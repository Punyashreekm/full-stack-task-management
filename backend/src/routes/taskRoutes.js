const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { manager } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, getTasks)
  .post(protect, manager, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, manager, deleteTask);

module.exports = router;
