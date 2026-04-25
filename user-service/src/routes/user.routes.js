const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getProfile);

module.exports = router;
