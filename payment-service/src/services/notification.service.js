/**
 * Notification Service
 * Logs notifications for successful/failed bookings
 */

const notifications = [];

function notifySuccess(data) {
  const { bookingId, userId, username, movieTitle, seatNumber, transactionId } = data;
  
  const message = `🎬 Booking #${bookingId} successful! User ${username} booked "${movieTitle}" (Seat ${seatNumber}). Transaction: ${transactionId}`;
  
  console.log(`\n🔔 ════════════════════════════════════════`);
  console.log(`🔔 NOTIFICATION: BOOKING CONFIRMED`);
  console.log(`🔔 ${message}`);
  console.log(`🔔 ════════════════════════════════════════\n`);

  notifications.push({
    type: 'SUCCESS',
    bookingId,
    userId,
    username,
    message,
    timestamp: new Date().toISOString(),
  });
}

function notifyFailure(data) {
  const { bookingId, userId, username, movieTitle, seatNumber, reason } = data;

  const message = `❌ Booking #${bookingId} failed! User ${username}'s booking for "${movieTitle}" (Seat ${seatNumber}) was declined. Reason: ${reason}`;

  console.log(`\n🔔 ════════════════════════════════════════`);
  console.log(`🔔 NOTIFICATION: BOOKING FAILED`);
  console.log(`🔔 ${message}`);
  console.log(`🔔 ════════════════════════════════════════\n`);

  notifications.push({
    type: 'FAILURE',
    bookingId,
    userId,
    username,
    message,
    timestamp: new Date().toISOString(),
  });
}

function getNotifications() {
  return notifications;
}

module.exports = { notifySuccess, notifyFailure, getNotifications };
