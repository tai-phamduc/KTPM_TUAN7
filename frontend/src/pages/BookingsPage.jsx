import { useState, useEffect, useCallback } from 'react';
import { getBookings, getNotifications } from '../services/api';

export default function BookingsPage({ user }) {
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('bookings'); // 'bookings' | 'notifications'

  const fetchData = useCallback(async () => {
    try {
      const [bookingData, notifData] = await Promise.all([
        getBookings(),
        getNotifications(user?.id),
      ]);
      setBookings(bookingData.bookings);
      setNotifications(notifData.notifications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();

    // Poll every 3 seconds to catch status updates
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="page">
        <div className="spinner"></div>
        <p className="loading-text">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>🎟️ My Bookings</h1>
        <p>Track your bookings and payment status</p>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          className={`btn ${tab === 'bookings' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setTab('bookings')}
        >
          Bookings ({bookings.length})
        </button>
        <button
          className={`btn ${tab === 'notifications' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setTab('notifications')}
        >
          🔔 Notifications ({notifications.length})
        </button>
        <button className="btn btn-ghost btn-sm" onClick={fetchData} style={{ marginLeft: 'auto' }}>
          🔄 Refresh
        </button>
      </div>

      {/* ── Bookings Tab ── */}
      {tab === 'bookings' && (
        <>
          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🎟️</div>
              <h3>No bookings yet</h3>
              <p>Go book a movie and your tickets will appear here</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Movie</th>
                    <th>Seat</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Booked At</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: '600' }}>#{b.id}</td>
                      <td>{b.movieTitle}</td>
                      <td>
                        <span className="tag" style={{ background: 'var(--bg-elevated)' }}>
                          {b.seatNumber}
                        </span>
                      </td>
                      <td>{(b.amount || 0).toLocaleString()} VND</td>
                      <td>
                        <span className={`badge badge-${b.status?.toLowerCase()}`}>
                          {b.status === 'PENDING' && '⏳'}
                          {b.status === 'CONFIRMED' && '✅'}
                          {b.status === 'FAILED' && '❌'}
                          {' '}{b.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(b.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="alert alert-info" style={{ marginTop: '20px' }}>
            💡 Booking statuses update automatically every 3 seconds via polling
          </div>
        </>
      )}

      {/* ── Notifications Tab ── */}
      {tab === 'notifications' && (
        <>
          {notifications.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🔔</div>
              <h3>No notifications yet</h3>
              <p>Notifications will appear here after booking</p>
            </div>
          ) : (
            <div className="notification-list">
              {[...notifications].reverse().map((n, i) => (
                <div
                  key={i}
                  className="notification-item"
                  style={{ borderLeftColor: n.type === 'SUCCESS' ? 'var(--success)' : 'var(--danger)', borderLeftWidth: '3px' }}
                >
                  <div style={{ fontSize: '0.9rem' }}>
                    {n.type === 'SUCCESS' ? '✅' : '❌'} {n.message}
                  </div>
                  <div className="notif-time">
                    {new Date(n.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
