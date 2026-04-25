require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/db');
const bookingRoutes = require('./routes/booking.routes');
const { setupEventListeners } = require('./events/subscriber');

const app = express();
const PORT = process.env.PORT || 8083;

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'booking-service', status: 'UP', port: PORT });
});

// Start server
async function start() {
  try {
    await sequelize.sync();
    console.log('📦 Database synced (bookings.sqlite)');

    // Setup Redis event listeners
    await setupEventListeners();

    app.listen(PORT, () => {
      console.log(`\n🚀 Booking Service (CORE) running on http://localhost:${PORT}`);
      console.log(`   POST /api/bookings`);
      console.log(`   GET  /api/bookings`);
      console.log(`   GET  /api/bookings/:id\n`);
    });
  } catch (err) {
    console.error('Failed to start Booking Service:', err);
    process.exit(1);
  }
}

start();
