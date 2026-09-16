// =============================================
// client/src/pages/PremiumDashboard.js
// Premium: play songs, like songs, create playlists
// =============================================

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MusicPlayer from '../components/MusicPlayer';
import SongCard from '../components/SongCard';

const PremiumDashboard = () => {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [activeTab, setActiveTab] = useState('songs');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchSongs = async () => {
    const res = await fetch('/api/songs', { credentials: 'include' });
    setSongs(await res.json());
  };

  const fetchPlaylists = async () => {
    const res = await fetch('/api/playlists', { credentials: 'include' });
    setPlaylists(await res.json());
  };

  useEffect(() => {
    fetchSongs();
    fetchPlaylists();
  }, []);

  const showMsg = (msg, isError = false) => {
    if (isError) setError(msg);
    else setMessage(msg);
    setTimeout(() => { setMessage(''); setError(''); }, 3000);
  };

  const handleLike = async (songId) => {
    try {
      const res = await fetch(`/api/songs/${songId}/like`, { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (res.ok) {
        setSongs(songs.map(s => s._id === songId ? { ...s, likes: data.likes } : s));
        showMsg('Song liked! ❤️');
      }
    } catch { showMsg('Failed to like song', true); }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    try {
      const res = await fetch('/api/playlists', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPlaylistName }),
      });
      if (res.ok) {
        setNewPlaylistName('');
        fetchPlaylists();
        showMsg('Playlist created!');
      }
    } catch { showMsg('Failed to create playlist', true); }
  };

  const handleAddToPlaylist = async (songId) => {
    if (!selectedPlaylist) return showMsg('Select a playlist first', true);
    try {
      const res = await fetch(`/api/playlists/${selectedPlaylist}/songs`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId }),
      });
      if (res.ok) showMsg('Added to playlist!');
    } catch { showMsg('Failed to add to playlist', true); }
  };

  const handleDeletePlaylist = async (id) => {
    await fetch(`/api/playlists/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchPlaylists();
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #f39c12, #d35400)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>⭐</div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#b3b3b3', textTransform: 'uppercase', letterSpacing: 1 }}>Premium</div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Premium Hub</h1>
            </div>
          </div>

          {/* Playlist selector for adding songs */}
          {playlists.length > 0 && (
            <div className="d-flex align-items-center gap-2 mb-4" style={{ background: '#181818', padding: '12px 16px', borderRadius: 8 }}>
              <i className="bi bi-collection-play" style={{ color: '#f39c12' }}></i>
              <span style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>Add to:</span>
              <select className="form-select form-select-sm" style={{ width: 'auto', background: '#282828', color: 'white', border: 'none' }}
                value={selectedPlaylist} onChange={e => setSelectedPlaylist(e.target.value)}>
                <option value="">Select playlist</option>
                {playlists.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
          )}

          <ul className="nav nav-pills mb-4">
            {['songs', 'playlists'].map(tab => (
              <li className="nav-item" key={tab}>
                <button className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  style={activeTab === tab ? { background: '#f39c12', color: 'black' } : { color: '#b3b3b3' }}
                  onClick={() => setActiveTab(tab)}>
                  {tab === 'songs' ? 'All Songs' : 'My Playlists'}
                </button>
              </li>
            ))}
          </ul>

          {message && <div className="alert-spotify alert-success-spotify mb-3">{message}</div>}
          {error && <div className="alert-spotify alert-error-spotify mb-3">{error}</div>}

          {activeTab === 'songs' && (
            <div id="songs">
              <div className="section-header">All Songs</div>
              <div className="row g-3">
                {songs.map(song => (
                  <div className="col-6 col-md-3 col-lg-2" key={song._id}>
                    <SongCard song={song} allSongs={songs}
                      showLike showAddToPlaylist
                      onLike={handleLike}
                      onAddToPlaylist={handleAddToPlaylist}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'playlists' && (
            <div id="playlists">
              <div className="section-header">My Playlists</div>

              {/* Create playlist form */}
              <form onSubmit={handleCreatePlaylist} className="d-flex gap-2 mb-4">
                <input type="text" className="form-control" placeholder="New playlist name..."
                  value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)}
                  style={{ maxWidth: 300 }} />
                <button type="submit" className="btn" style={{ background: '#f39c12', color: 'black', borderRadius: 20, padding: '8px 20px', fontWeight: 600 }}>
                  <i className="bi bi-plus-circle me-1"></i>Create
                </button>
              </form>

              {playlists.length === 0 && (
                <div style={{ color: '#b3b3b3', textAlign: 'center', padding: '40px 0' }}>
                  <i className="bi bi-collection-play" style={{ fontSize: '3rem', display: 'block', marginBottom: 12 }}></i>
                  No playlists yet. Create your first one!
                </div>
              )}

              <div className="row g-3">
                {playlists.map(playlist => (
                  <div className="col-12 col-md-6" key={playlist._id}>
                    <div style={{ background: '#181818', borderRadius: 8, padding: 20, border: '1px solid #282828' }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{playlist.name}</div>
                          <div style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>{playlist.songs?.length || 0} songs</div>
                        </div>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletePlaylist(playlist._id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                      {playlist.songs && playlist.songs.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {playlist.songs.slice(0, 5).map(song => (
                            <li key={song._id} style={{ padding: '6px 0', borderBottom: '1px solid #282828', color: '#b3b3b3', fontSize: '0.85rem' }}>
                              <i className="bi bi-music-note me-2" style={{ color: '#1DB954' }}></i>
                              {song.title} — {song.artist}
                            </li>
                          ))}
                          {playlist.songs.length > 5 && (
                            <li style={{ color: '#b3b3b3', fontSize: '0.8rem', paddingTop: 6 }}>
                              +{playlist.songs.length - 5} more songs
                            </li>
                          )}
                        </ul>
                      ) : (
                        <div style={{ color: '#535353', fontSize: '0.85rem' }}>Empty playlist</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default PremiumDashboard;
