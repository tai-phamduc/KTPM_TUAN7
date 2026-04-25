const Booking = require('../models/booking.model');
const { publishEvent } = require('../config/redis');

// POST /api/bookings
async function createBooking(req, res) {
  try {
    const { movieId, movieTitle, seatNumber, amount } = req.body;

    if (!movieId || !seatNumber) {
      return res.status(400).json({ error: 'movieId and seatNumber are required.' });
    }

    // Create booking with PENDING status
    const booking = await Booking.create({
      userId: req.user.id,
      username: req.user.username,
      movieId,
      movieTitle: movieTitle || `Movie #${movieId}`,
      seatNumber,
      amount: amount || 100000,
      status: 'PENDING',
    });

    // Publish BOOKING_CREATED event — DO NOT process payment here
    await publishEvent('BOOKING_CREATED', {
      bookingId: booking.id,
      userId: booking.userId,
      username: booking.username,
      movieId: booking.movieId,
      movieTitle: booking.movieTitle,
      seatNumber: booking.seatNumber,
      amount: booking.amount,
      status: booking.status,
    });

    res.status(201).json({
      message: 'Booking created successfully. Payment is being processed...',
      booking,
    });
  } catch (err) {
    console.error('CreateBooking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/bookings
async function getBookings(req, res) {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ bookings });
  } catch (err) {
    console.error('GetBookings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/bookings/:id
async function getBookingById(req, res) {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }
    if (booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    res.json({ booking });
  } catch (err) {
    console.error('GetBookingById error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { createBooking, getBookings, getBookingById };
