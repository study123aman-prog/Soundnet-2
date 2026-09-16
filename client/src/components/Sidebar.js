// =============================================
// client/src/components/Sidebar.js
// Left sidebar - shows links based on role
// =============================================

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">🎵 Music</div>
      <nav className="sidebar-nav">
        {/* Links shown to all logged-in users */}
        <NavLink to={`/${user?.role || 'guest'}`}>
          <i className="bi bi-house-fill"></i> Home
        </NavLink>

        {/* Admin links */}
        {user?.role === 'admin' && (
          <>
            <NavLink to="/admin"><i className="bi bi-speedometer2"></i> Dashboard</NavLink>
            <div style={{ color: '#535353', fontSize: '0.75rem', padding: '16px 12px 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin</div>
            <a href="#songs"><i className="bi bi-music-note-list"></i> All Songs</a>
            <a href="#users"><i className="bi bi-people-fill"></i> All Users</a>
            <a href="#upload"><i className="bi bi-cloud-upload"></i> Add Song</a>
          </>
        )}

        {/* Artist links */}
        {user?.role === 'artist' && (
          <>
            <div style={{ color: '#535353', fontSize: '0.75rem', padding: '16px 12px 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Artist</div>
            <a href="#songs"><i className="bi bi-music-note-list"></i> My Songs</a>
            <a href="#upload"><i className="bi bi-cloud-upload"></i> Upload Song</a>
          </>
        )}

        {/* Premium links */}
        {user?.role === 'premium' && (
          <>
            <div style={{ color: '#535353', fontSize: '0.75rem', padding: '16px 12px 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Premium</div>
            <a href="#songs"><i className="bi bi-music-note-list"></i> All Songs</a>
            <a href="#playlists"><i className="bi bi-collection-play"></i> My Playlists</a>
            <a href="#liked"><i className="bi bi-heart-fill"></i> Liked Songs</a>
          </>
        )}

        {/* Normal user links */}
        {(user?.role === 'user') && (
          <>
            <a href="#songs"><i className="bi bi-music-note-list"></i> All Songs</a>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
