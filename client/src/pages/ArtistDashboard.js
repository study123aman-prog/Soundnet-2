// =============================================
// client/src/pages/ArtistDashboard.js
// Artist: upload songs, manage own songs
// =============================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MusicPlayer from '../components/MusicPlayer';
import SongCard from '../components/SongCard';

const ArtistDashboard = () => {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [activeTab, setActiveTab] = useState('songs');
  const [uploadForm, setUploadForm] = useState({ title: '', artist: user?.name || '', album: '', genre: 'Pop' });
  const [uploadFile, setUploadFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSongs = async () => {
    const res = await fetch('/api/songs', { credentials: 'include' });
    const data = await res.json();
    // Show only songs by this artist (by name match)
    setSongs(data.filter(s => s.artist.toLowerCase() === user?.name?.toLowerCase() || s.uploadedBy === user?.id));
  };

  useEffect(() => { fetchSongs(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return setError('Please select an audio file');
    setLoading(true);
    setError('');
    const formData = new FormData();
    Object.entries(uploadForm).forEach(([k, v]) => formData.append(k, v));
    formData.append('file', uploadFile);

    try {
      const res = await fetch('/api/songs', { method: 'POST', credentials: 'include', body: formData });
      const data = await res.json();
      if (res.ok) {
        setMessage('Song uploaded!');
        setUploadForm({ title: '', artist: user?.name || '', album: '', genre: 'Pop' });
        setUploadFile(null);
        fetchSongs();
      } else {
        setError(data.message);
      }
    } catch { setError('Upload failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #9b59b6, #6c3483)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🎤</div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#b3b3b3', textTransform: 'uppercase', letterSpacing: 1 }}>Artist</div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>My Studio</h1>
            </div>
          </div>

          <ul className="nav nav-pills mb-4">
            {['songs', 'upload'].map(tab => (
              <li className="nav-item" key={tab}>
                <button className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  style={activeTab === tab ? { background: '#9b59b6', color: 'white' } : { color: '#b3b3b3' }}
                  onClick={() => setActiveTab(tab)}>
                  {tab === 'songs' ? 'My Songs' : 'Upload Song'}
                </button>
              </li>
            ))}
          </ul>

          {message && <div className="alert-spotify alert-success-spotify mb-3">{message}</div>}
          {error && <div className="alert-spotify alert-error-spotify mb-3">{error}</div>}

          {activeTab === 'songs' && (
            <div>
              <div className="section-header">My Songs ({songs.length})</div>
              {songs.length === 0 && (
                <div style={{ color: '#b3b3b3', textAlign: 'center', padding: '40px 0' }}>
                  <i className="bi bi-music-note-list" style={{ fontSize: '3rem', display: 'block', marginBottom: 12 }}></i>
                  No songs yet. Upload your first track!
                </div>
              )}
              <div className="row g-3">
                {songs.map(song => (
                  <div className="col-6 col-md-3 col-lg-2" key={song._id}>
                    <SongCard song={song} allSongs={songs} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div style={{ maxWidth: 500 }}>
              <div className="section-header">Upload New Track</div>
              <div style={{ background: '#181818', borderRadius: 8, padding: 24, border: '1px solid #282828' }}>
                <form onSubmit={handleUpload}>
                  <div className="mb-3">
                    <label className="form-label">Song Title *</label>
                    <input type="text" className="form-control" placeholder="Track title" required
                      value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Artist Name</label>
                    <input type="text" className="form-control" value={uploadForm.artist}
                      onChange={e => setUploadForm({ ...uploadForm, artist: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Album</label>
                    <input type="text" className="form-control" placeholder="Album (optional)"
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
                    <label className="form-label">Audio File *</label>
                    <div className="upload-zone" onClick={() => document.getElementById('artistAudio').click()}>
                      <i className="bi bi-cloud-upload" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}></i>
                      {uploadFile ? uploadFile.name : 'Click to select MP3 / WAV / OGG'}
                    </div>
                    <input id="artistAudio" type="file" accept="audio/*" style={{ display: 'none' }}
                      onChange={e => setUploadFile(e.target.files[0])} />
                  </div>
                  <button type="submit" className="btn-spotify" disabled={loading}
                    style={{ background: '#9b59b6' }}>
                    {loading ? 'Uploading...' : 'Release Track'}
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

export default ArtistDashboard;
