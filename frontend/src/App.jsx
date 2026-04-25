import { useState } from 'react';
import './index.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MoviesPage from './pages/MoviesPage';
import BookingsPage from './pages/BookingsPage';

function App() {
  const [page, setPage] = useState('movies');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  function handleLogin(userData, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setPage('movies');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('movies');
  }

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-brand">
          🎬 <span>CineTicket</span>
        </div>

        <div className="navbar-links">
          <button
            className={`nav-link ${page === 'movies' ? 'active' : ''}`}
            onClick={() => setPage('movies')}
          >
            Movies
          </button>

          {user && (
            <button
              className={`nav-link ${page === 'bookings' ? 'active' : ''}`}
              onClick={() => setPage('bookings')}
            >
              My Bookings
            </button>
          )}
        </div>

        <div className="navbar-user">
          {user ? (
            <>
              <div className="user-badge">
                <div className="avatar">{user.username[0].toUpperCase()}</div>
                {user.username}
              </div>
              <button className="nav-link accent" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className={`nav-link ${page === 'login' ? 'active' : ''}`}
                onClick={() => setPage('login')}
              >
                Login
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setPage('register')}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── Pages ── */}
      {page === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onSwitchToRegister={() => setPage('register')}
        />
      )}
      {page === 'register' && (
        <RegisterPage
          onRegister={handleLogin}
          onSwitchToLogin={() => setPage('login')}
        />
      )}
      {page === 'movies' && <MoviesPage user={user} onNeedLogin={() => setPage('login')} />}
      {page === 'bookings' && <BookingsPage user={user} />}
    </>
  );
}

export default App;
