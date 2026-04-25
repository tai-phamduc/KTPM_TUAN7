const { publishEvent } = require('../config/redis');

/**
 * Simulate payment processing
 * 70% chance of success, 30% chance of failure
 */
async function processPayment(bookingData) {
  const { bookingId, userId, username, movieTitle, seatNumber, amount } = bookingData;

  console.log(`\n💳 ════════════════════════════════════════`);
  console.log(`💳 Processing payment for Booking #${bookingId}`);
  console.log(`💳 User: ${username} (ID: ${userId})`);
  console.log(`💳 Movie: ${movieTitle} | Seat: ${seatNumber}`);
  console.log(`💳 Amount: ${amount?.toLocaleString()} VND`);
  console.log(`💳 ════════════════════════════════════════\n`);

  // Simulate processing delay (1-3 seconds)
  const delay = Math.floor(Math.random() * 2000) + 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Random success/failure (70% success)
  const isSuccess = Math.random() < 0.7;

  if (isSuccess) {
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    console.log(`✅ Payment SUCCESSFUL for Booking #${bookingId}`);
    console.log(`   Transaction ID: ${transactionId}\n`);

    // Publish PAYMENT_COMPLETED
    await publishEvent('PAYMENT_COMPLETED', {
      bookingId,
      userId,
      username,
      movieTitle,
      seatNumber,
      transactionId,
      amount,
    });
  } else {
    console.log(`❌ Payment FAILED for Booking #${bookingId}`);
    console.log(`   Reason: Payment declined (simulated)\n`);

    // Publish BOOKING_FAILED
    await publishEvent('BOOKING_FAILED', {
      bookingId,
      userId,
      username,
      movieTitle,
      seatNumber,
      reason: 'Payment declined (simulated)',
    });
  }
}

module.exports = { processPayment };
