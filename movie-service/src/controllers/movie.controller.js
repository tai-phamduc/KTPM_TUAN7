const Movie = require('../models/movie.model');

// GET /api/movies
async function getMovies(req, res) {
  try {
    const movies = await Movie.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ movies });
  } catch (err) {
    console.error('GetMovies error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/movies/:id
async function getMovieById(req, res) {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    res.json({ movie });
  } catch (err) {
    console.error('GetMovieById error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/movies
async function createMovie(req, res) {
  try {
    const { title, description, genre, duration, price, posterUrl, showtime, totalSeats } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const movie = await Movie.create({
      title,
      description,
      genre,
      duration,
      price: price || 100000,
      posterUrl: posterUrl || '',
      showtime,
      totalSeats: totalSeats || 50,
    });

    res.status(201).json({ message: 'Movie created successfully', movie });
  } catch (err) {
    console.error('CreateMovie error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// PUT /api/movies/:id
async function updateMovie(req, res) {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }

    const { title, description, genre, duration, price, posterUrl, showtime, totalSeats } = req.body;
    await movie.update({ title, description, genre, duration, price, posterUrl, showtime, totalSeats });

    res.json({ message: 'Movie updated successfully', movie });
  } catch (err) {
    console.error('UpdateMovie error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getMovies, getMovieById, createMovie, updateMovie };
