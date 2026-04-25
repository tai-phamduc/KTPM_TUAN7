const express = require('express');
const router = express.Router();
const { createBooking, getBookings, getBookingById } = require('../controllers/booking.controller');
const authMiddleware = require('../middleware/auth');

// All booking routes require authentication
router.post('/', authMiddleware, createBooking);
router.get('/', authMiddleware, getBookings);
router.get('/:id', authMiddleware, getBookingById);

module.exports = router;
