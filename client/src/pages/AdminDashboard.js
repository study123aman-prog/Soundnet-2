// =============================================
// client/src/pages/AdminDashboard.js
// Admin: view all songs, users, add/delete songs
// =============================================

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MusicPlayer from '../components/MusicPlayer';
import SongCard from '../components/SongCard';

const AdminDashboard = () => {
  const [songs, setSongs] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('songs');
  const [uploadForm, setUploadForm] = useState({ title: '', artist: '', album: '', genre: 'Pop' });
  const [uploadFile, setUploadFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch songs from backend using fetch/AJAX
  const fetchSongs = async () => {
    try {
      const res = await fetch('/api/songs', { credentials: 'include' });
      const data = await res.json();
      setSongs(data);
    } catch (err) {
      setError('Failed to load songs');
    }
  };

  // Fetch all users (admin only)
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', { credentials: 'include' });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  useEffect(() => {
    fetchSongs();
    fetchUsers();
  }, []);

  // Upload a new song
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return setError('Please select an audio file');
    setLoading(true);
    setError('');
    setMessage('');

    // Use FormData for multipart file upload
    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('artist', uploadForm.artist);
    formData.append('album', uploadForm.album);
    formData.append('genre', uploadForm.genre);
    formData.append('file', uploadFile);

    try {
      const res = await fetch('/api/songs', {
        method: 'POST',
        credentials: 'include',
        body: formData, // Don't set Content-Type header - browser sets it with boundary
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Song uploaded successfully!');
        setUploadForm({ title: '', artist: '', album: '', genre: 'Pop' });
        setUploadFile(null);
        fetchSongs();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  // Delete a song
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this song?')) return;
    try {
      await fetch(`/api/songs/${id}`, { method: 'DELETE', credentials: 'include' });
      setSongs(songs.filter(s => s._id !== id));
      setMessage('Song deleted');
    } catch {
      setError('Delete failed');
    }
  };

  // Delete a user
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE', credentials: 'include' });
      setUsers(users.filter(u => u._id !== id));
    } catch {
      setError('Delete failed');
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">

          {/* Header */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #e74c3c, #c0392b)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👑</div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#b3b3b3', textTransform: 'uppercase', letterSpacing: 1 }}>Dashboard</div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Admin Panel</h1>
            </div>
          </div>

          {/* Stats row */}
          <div className="row g-3 mb-4">
            {[
              { label: 'Total Songs', value: songs.length, icon: 'music-note-list', color: '#1DB954' },
              { label: 'Total Users', value: users.length, icon: 'people-fill', color: '#3498db' },
              { label: 'Artists', value: users.filter(u => u.role === 'artist').length, icon: 'mic-fill', color: '#9b59b6' },
              { label: 'Premium', value: users.filter(u => u.role === 'premium').length, icon: 'star-fill', color: '#f39c12' },
            ].map(stat => (
              <div className="col-6 col-md-3" key={stat.label}>
                <div style={{ background: '#181818', borderRadius: 8, padding: '20px', border: '1px solid #282828' }}>
                  <i className={`bi bi-${stat.icon}`} style={{ color: stat.color, fontSize: '1.5rem' }}></i>
                  <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: 8 }}>{stat.value}</div>
                  <div style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <ul className="nav nav-pills mb-4">
            {['songs', 'users', 'upload'].map(tab => (
              <li className="nav-item" key={tab}>
                <button className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  style={activeTab === tab ? { background: '#1DB954', color: 'black' } : { color: '#b3b3b3' }}
                  onClick={() => setActiveTab(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>

          {/* Messages */}
          {message && <div className="alert-spotify alert-success-spotify mb-3">{message}</div>}
          {error && <div className="alert-spotify alert-error-spotify mb-3">{error}</div>}

          {/* Songs Tab */}
          {activeTab === 'songs' && (
            <div id="songs">
              <div className="section-header">All Songs ({songs.length})</div>
              <div className="row g-3">
                {songs.map(song => (
                  <div className="col-6 col-md-3 col-lg-2" key={song._id}>
                    <SongCard song={song} allSongs={songs} showDelete onDelete={handleDelete} />
                  </div>
                ))}
                {songs.length === 0 && <div style={{ color: '#b3b3b3' }}>No songs yet. Upload one!</div>}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div id="users">
              <div className="section-header">All Users ({users.length})</div>
              <div style={{ background: '#181818', borderRadius: 8, overflow: 'hidden', border: '1px solid #282828' }}>
                <table className="table dark-table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id}>
                        <td style={{ color: '#b3b3b3' }}>{i + 1}</td>
                        <td>{u.name}</td>
                        <td style={{ color: '#b3b3b3' }}>{u.email}</td>
                        <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                        <td style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(u._id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div id="upload" style={{ maxWidth: 500 }}>
              <div className="section-header">Upload New Song</div>
              <div style={{ background: '#181818', borderRadius: 8, padding: 24, border: '1px solid #282828' }}>
                <form onSubmit={handleUpload}>
                  <div className="mb-3">
                    <label className="form-label">Song Title *</label>
                    <input type="text" className="form-control" placeholder="Song title" required
                      value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Artist Name *</label>
                    <input type="text" className="form-control" placeholder="Artist name" required
                      value={uploadForm.artist} onChange={e => setUploadForm({ ...uploadForm, artist: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Album</label>
                    <input type="text" className="form-control" placeholder="Album name"
                      value={uploadForm.album} onChange={e => setUploadForm({ ...uploadForm, album: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Genre</label>
                    <select className="form-select" value={uploadForm.genre} onChange={e => setUploadForm({ ...uploadForm, genre: e.target.value })}>
                      {['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Audio File * (MP3, WAV, OGG)</label>
                    <div className="upload-zone" onClick={() => document.getElementById('audioInput').click()}>
                      <i className="bi bi-cloud-upload" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}></i>
                      {uploadFile ? uploadFile.name : 'Click to select audio file'}
                    </div>
                    <input id="audioInput" type="file" accept="audio/*" style={{ display: 'none' }}
                      onChange={e => setUploadFile(e.target.files[0])} />
                  </div>
                  <button type="submit" className="btn-spotify" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload Song'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default AdminDashboard;
