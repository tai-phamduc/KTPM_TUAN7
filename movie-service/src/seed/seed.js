const Movie = require('../models/movie.model');

const seedMovies = [
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a C.E.O.',
    genre: 'Sci-Fi',
    duration: 148,
    price: 120000,
    posterUrl: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqNgWeRnEkO0WS1PQ.jpg',
    showtime: '19:00',
    totalSeats: 50,
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    genre: 'Action',
    duration: 152,
    price: 110000,
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUgMe1VY39l.jpg',
    showtime: '20:30',
    totalSeats: 60,
  },
  {
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    genre: 'Sci-Fi',
    duration: 169,
    price: 130000,
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    showtime: '18:00',
    totalSeats: 45,
  },
  {
    title: 'Parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    genre: 'Thriller',
    duration: 132,
    price: 100000,
    posterUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    showtime: '21:00',
    totalSeats: 40,
  },
  {
    title: 'Spider-Man: No Way Home',
    description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
    genre: 'Action',
    duration: 148,
    price: 140000,
    posterUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    showtime: '17:00',
    totalSeats: 55,
  },
  {
    title: 'Dune',
    description: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir becomes troubled by visions of a dark future.',
    genre: 'Sci-Fi',
    duration: 155,
    price: 135000,
    posterUrl: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    showtime: '19:30',
    totalSeats: 50,
  },
];

async function seedDatabase() {
  const count = await Movie.count();
  if (count === 0) {
    await Movie.bulkCreate(seedMovies);
    console.log('🎬 Seeded database with', seedMovies.length, 'movies');
  } else {
    console.log(`🎬 Database already has ${count} movies, skipping seed`);
  }
}

module.exports = { seedDatabase };
