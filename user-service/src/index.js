require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/db');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 8081;

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
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'user-service', status: 'UP', port: PORT });
});

// Start server
async function start() {
  try {
    await sequelize.sync();
    console.log('📦 Database synced (users.sqlite)');

    app.listen(PORT, () => {
      console.log(`\n🚀 User Service running on http://localhost:${PORT}`);
      console.log(`   POST /api/users/register`);
      console.log(`   POST /api/users/login`);
      console.log(`   GET  /api/users/me\n`);
    });
  } catch (err) {
    console.error('Failed to start User Service:', err);
    process.exit(1);
  }
}

start();
