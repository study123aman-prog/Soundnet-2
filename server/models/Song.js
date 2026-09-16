// =============================================
// server/models/Song.js - Song Schema
// =============================================

const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true,
  },
  artist: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true,
  },
  album: {
    type: String,
    default: 'Unknown Album',
  },
  genre: {
    type: String,
    default: 'Pop',
  },
  duration: {
    type: String,
    default: '0:00',
  },
  // File URL - path to uploaded audio file
  fileUrl: {
    type: String,
    required: true,
  },
  // Cover image URL
  coverUrl: {
    type: String,
    default: '/uploads/default-cover.png',
  },
  // Who uploaded this song (artist's user ID)
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Song', SongSchema);
