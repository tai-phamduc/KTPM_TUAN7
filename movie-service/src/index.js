require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/db');
const movieRoutes = require('./routes/movie.routes');
const { seedDatabase } = require('./seed/seed');

const app = express();
const PORT = process.env.PORT || 8082;

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
app.use('/api/movies', movieRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'movie-service', status: 'UP', port: PORT });
});

// Start server
async function start() {
  try {
    await sequelize.sync();
    console.log('📦 Database synced (movies.sqlite)');

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`\n🚀 Movie Service running on http://localhost:${PORT}`);
      console.log(`   GET  /api/movies`);
      console.log(`   GET  /api/movies/:id`);
      console.log(`   POST /api/movies`);
      console.log(`   PUT  /api/movies/:id\n`);
    });
  } catch (err) {
    console.error('Failed to start Movie Service:', err);
    process.exit(1);
  }
}

start();
