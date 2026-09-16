// =============================================
// server/index.js - Main Express Server Entry
// =============================================

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ---- MongoDB Connection ----
// Replace this URI with your own MongoDB Atlas URI or local URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spotify_clone';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ---- Middleware ----
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// CORS - allow React frontend (port 3000) to talk to backend (port 5000)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Allow cookies/sessions
}));

// Session Setup - stores session in MongoDB
app.use(session({
  secret: process.env.SESSION_SECRET || 'spotify_clone_secret_key_2024',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
  }
}));

// Serve uploaded files (songs, images) as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---- Routes ----
app.use('/api/auth', require('./routes/auth'));   // Signup / Login / Logout
app.use('/api/songs', require('./routes/songs')); // Song CRUD
app.use('/api/users', require('./routes/users')); // User management
app.use('/api/playlists', require('./routes/playlists')); // Playlist management

// ---- Default Route ----
app.get('/', (req, res) => {
  res.json({ message: 'Spotify Clone API is running 🎵' });
});

// ---- Start Server ----
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
