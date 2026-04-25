require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { subscribeToEvent } = require('./config/redis');
const { processPayment } = require('./services/payment.service');
const { notifySuccess, notifyFailure, getNotifications } = require('./services/notification.service');

const app = express();
const PORT = process.env.PORT || 8084;

// Middleware
app.use(cors());
app.use(express.json());

// API to view notifications (for frontend polling)
app.get('/api/notifications', (req, res) => {
  const userId = req.query.userId;
  let notifications = getNotifications();
  if (userId) {
    notifications = notifications.filter((n) => String(n.userId) === String(userId));
  }
  res.json({ notifications });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'payment-notification-service', status: 'UP', port: PORT });
});

// Setup event listeners
async function setupEvents() {
  // Listen for BOOKING_CREATED → process payment
  await subscribeToEvent('BOOKING_CREATED', async (event) => {
    console.log(`\n⚡ Received BOOKING_CREATED event, starting payment processing...`);
    await processPayment(event.data);
  });

  // We need a separate subscriber for notification events
  // Since Redis Pub/Sub uses a single subscriber connection per channel,
  // we create another subscriber for PAYMENT_COMPLETED and BOOKING_FAILED
  const redis = require('redis');
  const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
  
  const notifSubscriber = redis.createClient({ url: REDIS_URL });
  await notifSubscriber.connect();
  console.log('📡 Notification subscriber connected');

  // Listen for PAYMENT_COMPLETED → send success notification
  await notifSubscriber.subscribe('PAYMENT_COMPLETED', (message) => {
    const parsed = JSON.parse(message);
    notifySuccess(parsed.data);
  });

  // Listen for BOOKING_FAILED → send failure notification
  await notifSubscriber.subscribe('BOOKING_FAILED', (message) => {
    const parsed = JSON.parse(message);
    notifyFailure(parsed.data);
  });

  console.log('👂 Notification listener active on PAYMENT_COMPLETED & BOOKING_FAILED');
}

// Start
async function start() {
  try {
    await setupEvents();

    app.listen(PORT, () => {
      console.log(`\n🚀 Payment + Notification Service running on http://localhost:${PORT}`);
      console.log(`   GET /api/notifications`);
      console.log(`   Listening for: BOOKING_CREATED`);
      console.log(`   Publishing:    PAYMENT_COMPLETED / BOOKING_FAILED`);
      console.log(`   Notifying on:  PAYMENT_COMPLETED / BOOKING_FAILED\n`);
    });
  } catch (err) {
    console.error('Failed to start Payment Service:', err);
    process.exit(1);
  }
}

start();
