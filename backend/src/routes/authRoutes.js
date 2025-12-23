const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { manager } = require('../middleware/roleMiddleware');

router.post('/login', authUser);
router.post('/signup', registerUser);
router.get('/users', protect, manager, getUsers);

module.exports = router;
