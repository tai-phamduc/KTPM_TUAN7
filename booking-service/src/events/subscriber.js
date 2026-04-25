const { subscribeToEvent } = require('../config/redis');
const Booking = require('../models/booking.model');

async function setupEventListeners() {
  // Listen for PAYMENT_COMPLETED → update booking to CONFIRMED
  await subscribeToEvent('PAYMENT_COMPLETED', async (event) => {
    const { bookingId } = event.data;
    try {
      const booking = await Booking.findByPk(bookingId);
      if (booking) {
        booking.status = 'CONFIRMED';
        await booking.save();
        console.log(`✅ Booking #${bookingId} status updated to CONFIRMED`);
      }
    } catch (err) {
      console.error(`Error updating booking #${bookingId} to CONFIRMED:`, err);
    }
  });

  // Listen for BOOKING_FAILED → update booking to FAILED
  await subscribeToEvent('BOOKING_FAILED', async (event) => {
    const { bookingId } = event.data;
    try {
      const booking = await Booking.findByPk(bookingId);
      if (booking) {
        booking.status = 'FAILED';
        await booking.save();
        console.log(`❌ Booking #${bookingId} status updated to FAILED`);
      }
    } catch (err) {
      console.error(`Error updating booking #${bookingId} to FAILED:`, err);
    }
  });
}

module.exports = { setupEventListeners };
