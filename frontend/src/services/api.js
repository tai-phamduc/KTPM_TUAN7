const USER_SERVICE = 'http://localhost:8081/api';
const MOVIE_SERVICE = 'http://localhost:8082/api';
const BOOKING_SERVICE = 'http://localhost:8083/api';
const PAYMENT_SERVICE = 'http://localhost:8084/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── User Service ──────────────────────────────────────
export async function registerUser(username, email, password) {
  const res = await fetch(`${USER_SERVICE}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function loginUser(username, password) {
  const res = await fetch(`${USER_SERVICE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

// ── Movie Service ─────────────────────────────────────
export async function getMovies() {
  const res = await fetch(`${MOVIE_SERVICE}/movies`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch movies');
  return data;
}

export async function getMovieById(id) {
  const res = await fetch(`${MOVIE_SERVICE}/movies/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch movie');
  return data;
}

// ── Booking Service ───────────────────────────────────
export async function createBooking(movieId, movieTitle, seatNumber, amount) {
  const res = await fetch(`${BOOKING_SERVICE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ movieId, movieTitle, seatNumber, amount }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Booking failed');
  return data;
}

export async function getBookings() {
  const res = await fetch(`${BOOKING_SERVICE}/bookings`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch bookings');
  return data;
}

// ── Notification Service ──────────────────────────────
export async function getNotifications(userId) {
  const url = userId
    ? `${PAYMENT_SERVICE}/notifications?userId=${userId}`
    : `${PAYMENT_SERVICE}/notifications`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch notifications');
  return data;
}
