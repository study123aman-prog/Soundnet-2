// =============================================
// client/src/pages/UserDashboard.js
// Normal user: browse and play songs only
// =============================================

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MusicPlayer from '../components/MusicPlayer';
import SongCard from '../components/SongCard';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    fetch('/api/songs', { credentials: 'include' })
      .then(r => r.json())
      .then(setSongs)
      .catch(console.error);
  }, []);

  const genres = ['All', ...new Set(songs.map(s => s.genre || 'Pop'))];

  const filteredSongs = songs.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist.toLowerCase().includes(search.toLowerCase());
    const matchGenre = selectedGenre === 'All' || s.genre === selectedGenre;
    return matchSearch && matchGenre;
  });

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">
          {/* Greeting */}
          <div className="mb-4">
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: '#b3b3b3' }}>Ready to listen to some music?</p>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="input-group" style={{ maxWidth: 400 }}>
              <span className="input-group-text" style={{ background: '#282828', border: 'none', color: '#b3b3b3' }}>
                <i className="bi bi-search"></i>
              </span>
              <input type="text" className="form-control" placeholder="Search songs or artists..."
                style={{ background: '#282828', border: 'none', color: 'white' }}
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* Genre filter */}
          <div className="d-flex gap-2 flex-wrap mb-4">
            {genres.map(g => (
              <button key={g} onClick={() => setSelectedGenre(g)}
                className="btn btn-sm"
                style={{
                  background: selectedGenre === g ? '#1DB954' : '#282828',
                  color: selectedGenre === g ? 'black' : '#b3b3b3',
                  border: 'none', borderRadius: 20, padding: '6px 16px',
                  fontWeight: selectedGenre === g ? 700 : 400
                }}>
                {g}
              </button>
            ))}
          </div>

          <div className="section-header">
            {search ? `Results for "${search}"` : 'All Songs'} ({filteredSongs.length})
          </div>

          <div className="row g-3">
            {filteredSongs.map(song => (
              <div className="col-6 col-md-3 col-lg-2" key={song._id}>
                <SongCard song={song} allSongs={filteredSongs} />
              </div>
            ))}
            {filteredSongs.length === 0 && (
              <div style={{ color: '#b3b3b3', padding: '40px 0', textAlign: 'center', width: '100%' }}>
                <i className="bi bi-search" style={{ fontSize: '3rem', display: 'block', marginBottom: 12 }}></i>
                No songs found
              </div>
            )}
          </div>

          {/* Upgrade banner */}
          <div style={{ background: 'linear-gradient(90deg, #1DB954, #148a3d)', borderRadius: 8, padding: '20px 24px', marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Upgrade to Premium</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Like songs, create playlists, and more!</div>
            </div>
            <button className="btn" style={{ background: 'black', color: 'white', borderRadius: 20, padding: '8px 20px', fontWeight: 700 }}>
              Upgrade
            </button>
          </div>
        </div>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default UserDashboard;
