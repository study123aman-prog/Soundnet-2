// =============================================
// client/src/pages/GuestDashboard.js
// Guest: view limited songs, no login required
// =============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MusicPlayer from '../components/MusicPlayer';
import SongCard from '../components/SongCard';

const GuestDashboard = () => {
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Guests can fetch songs without authentication
    fetch('/api/songs')
      .then(r => r.json())
      .then(data => setSongs(data.slice(0, 6))) // Limit to 6 songs for guests
      .catch(console.error);
  }, []);

  return (
    <div className="app-layout">
      {/* Simple guest navbar */}
      <div className="top-navbar">
        <span className="nav-brand">🎵 SpotifyClone</span>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-light rounded-pill" onClick={() => navigate('/signup')}>Sign up</button>
          <button className="btn btn-sm rounded-pill" style={{ background: '#1DB954', color: 'black', fontWeight: 700 }} onClick={() => navigate('/login')}>Log in</button>
        </div>
      </div>

      <div className="main-content">
        <div className="page-content">
          {/* Hero banner */}
          <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)', borderRadius: 12, padding: '40px 32px', marginBottom: 40, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎵</div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>Music for everyone.</h1>
            <p style={{ color: '#b3b3b3', fontSize: '1.1rem', marginBottom: 24 }}>Millions of songs. No credit card needed.</p>
            <button className="btn" style={{ background: '#1DB954', color: 'black', borderRadius: 30, padding: '14px 40px', fontWeight: 700, fontSize: '1rem' }}
              onClick={() => navigate('/signup')}>
              Get SpotifyClone Free
            </button>
          </div>

          {/* Preview songs */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="section-header mb-0">Preview — Top Songs</div>
            <span style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>Showing {songs.length} of many</span>
          </div>

          <div className="row g-3 mb-4">
            {songs.map(song => (
              <div className="col-6 col-md-3 col-lg-2" key={song._id}>
                <SongCard song={song} allSongs={songs} />
              </div>
            ))}
            {songs.length === 0 && (
              <div style={{ color: '#b3b3b3', padding: '20px' }}>No preview songs available.</div>
            )}
          </div>

          {/* CTA to sign up */}
          <div style={{ background: '#181818', border: '1px solid #282828', borderRadius: 12, padding: '32px', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 8 }}>
              Want to hear more?
            </div>
            <p style={{ color: '#b3b3b3', marginBottom: 20 }}>
              Create a free account to access all songs, or go Premium for playlists and likes.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <button className="btn" style={{ background: '#1DB954', color: 'black', borderRadius: 30, padding: '12px 32px', fontWeight: 700 }}
                onClick={() => navigate('/signup')}>
                Sign up free
              </button>
              <button className="btn btn-outline-light rounded-pill" onClick={() => navigate('/login')}>
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default GuestDashboard;
