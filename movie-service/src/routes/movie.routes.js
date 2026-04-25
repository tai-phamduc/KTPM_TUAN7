const express = require('express');
const router = express.Router();
const { getMovies, getMovieById, createMovie, updateMovie } = require('../controllers/movie.controller');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', getMovies);
router.get('/:id', getMovieById);

// Protected routes (admin)
router.post('/', authMiddleware, createMovie);
router.put('/:id', authMiddleware, updateMovie);

module.exports = router;
