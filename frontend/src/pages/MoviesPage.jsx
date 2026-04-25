import { useState, useEffect } from 'react';
import { getMovies, createBooking } from '../services/api';

const ROWS = ['A', 'B', 'C', 'D', 'E'];
const COLS = 10;

function generateSeats() {
  const seats = [];
  for (const row of ROWS) {
    for (let col = 1; col <= COLS; col++) {
      seats.push(`${row}${col}`);
    }
  }
  return seats;
}

export default function MoviesPage({ user, onNeedLogin }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking modal state
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const allSeats = generateSeats();

  useEffect(() => {
    fetchMovies();
  }, []);

  async function fetchMovies() {
    try {
      setLoading(true);
      const data = await getMovies();
      setMovies(data.movies);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleBookClick(movie) {
    if (!user) {
      onNeedLogin();
      return;
    }
    setSelectedMovie(movie);
    setSelectedSeat('');
    setBookingResult(null);
  }

  async function handleConfirmBooking() {
    if (!selectedSeat || !selectedMovie) return;
    setBookingLoading(true);
    setBookingResult(null);

    try {
      const data = await createBooking(
        selectedMovie.id,
        selectedMovie.title,
        selectedSeat,
        selectedMovie.price
      );
      setBookingResult({
        type: 'success',
        message: `Booking #${data.booking.id} created! Payment is being processed...`,
      });
    } catch (err) {
      setBookingResult({ type: 'error', message: err.message });
    } finally {
      setBookingLoading(false);
    }
  }

  function closeModal() {
    setSelectedMovie(null);
    setSelectedSeat('');
    setBookingResult(null);
  }

  if (loading) {
    return (
      <div className="page">
        <div className="spinner"></div>
        <p className="loading-text">Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="alert alert-error">⚠️ {error}</div>
        <button className="btn btn-secondary" onClick={fetchMovies}>Retry</button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>🎬 Now Showing</h1>
        <p>Select a movie to book your tickets</p>
      </div>

      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card" onClick={() => handleBookClick(movie)}>
            <div className="poster">🎞️</div>
            <div className="info">
              <h3>{movie.title}</h3>
              <div className="meta">
                <span className="tag">{movie.genre || 'Movie'}</span>
                <span className="tag">{movie.duration || '?'} min</span>
                <span className="tag">🕐 {movie.showtime || 'TBA'}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.5' }}>
                {movie.description?.substring(0, 100)}...
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="price">{(movie.price || 0).toLocaleString()} VND</span>
                <button className="btn btn-primary btn-sm">Book Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {movies.length === 0 && (
        <div className="empty-state">
          <div className="icon">🎬</div>
          <h3>No movies available</h3>
          <p>Check back later for new showings</p>
        </div>
      )}

      {/* ── Booking Modal ── */}
      {selectedMovie && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Book Ticket</h2>
            <p className="subtitle">{selectedMovie.title} — {selectedMovie.showtime || 'TBA'}</p>

            {bookingResult ? (
              <>
                <div className={`alert alert-${bookingResult.type === 'success' ? 'success' : 'error'}`}>
                  {bookingResult.type === 'success' ? '✅' : '❌'} {bookingResult.message}
                </div>
                <div className="modal-actions">
                  <button className="btn btn-secondary btn-full" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="screen-label">── SCREEN ──</div>

                <div className="seat-grid">
                  {allSeats.map((seat) => (
                    <button
                      key={seat}
                      className={`seat ${selectedSeat === seat ? 'selected' : ''}`}
                      onClick={() => setSelectedSeat(seat)}
                    >
                      {seat}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Selected Seat</div>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{selectedSeat || 'None'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Price</div>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--accent)' }}>
                      {(selectedMovie.price || 0).toLocaleString()} VND
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    disabled={!selectedSeat || bookingLoading}
                    onClick={handleConfirmBooking}
                  >
                    {bookingLoading ? 'Processing...' : `Confirm Booking — Seat ${selectedSeat || '?'}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
