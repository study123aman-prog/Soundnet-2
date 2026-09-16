// =============================================
// server/routes/songs.js - Song Routes
// =============================================

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Song = require('../models/Song');
const { requireLogin, requireRole } = require('../middleware/auth');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/songs';
    // Create folder if it doesn't exist
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Use timestamp + original name to avoid duplicates
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files allowed!'), false);
    }
  }
});

// GET /api/songs - Get all songs (all roles, even guests)
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching songs' });
  }
});

// GET /api/songs/:id - Get single song
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching song' });
  }
});

// POST /api/songs - Upload a new song (Admin or Artist only)
router.post('/', requireRole('admin', 'artist'), upload.single('file'), async (req, res) => {
  try {
    const { title, artist, album, genre, duration } = req.body;

    if (!req.file) return res.status(400).json({ message: 'Audio file is required' });

    const song = await Song.create({
      title,
      artist,
      album: album || 'Unknown Album',
      genre: genre || 'Pop',
      duration: duration || '0:00',
      fileUrl: `/uploads/songs/${req.file.filename}`,
      uploadedBy: req.session.user.id,
    });

    res.status(201).json({ message: 'Song uploaded successfully', song });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Error uploading song' });
  }
});

// DELETE /api/songs/:id - Delete a song (Admin only)
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json({ message: 'Song deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting song' });
  }
});

// POST /api/songs/:id/like - Like a song (Premium users)
router.post('/:id/like', requireRole('premium', 'admin'), async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json({ message: 'Song liked!', likes: song.likes });
  } catch (err) {
    res.status(500).json({ message: 'Error liking song' });
  }
});

module.exports = router;
