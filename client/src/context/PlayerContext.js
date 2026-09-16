// =============================================
// client/src/context/PlayerContext.js
// Global music player state
// =============================================

import React, { createContext, useState, useRef, useContext } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null); // Currently playing song
  const [isPlaying, setIsPlaying] = useState(false);    // Play/pause state
  const [queue, setQueue] = useState([]);               // Song queue
  const [currentIndex, setCurrentIndex] = useState(0); // Index in queue
  const audioRef = useRef(null);                        // HTML audio element ref

  // Play a specific song
  const playSong = (song, songList = []) => {
    setCurrentSong(song);
    setQueue(songList);
    const idx = songList.findIndex(s => s._id === song._id);
    setCurrentIndex(idx >= 0 ? idx : 0);
    setIsPlaying(true);
  };

  // Toggle play/pause
  // Just flip state — MusicPlayer's useEffect handles actual audio play/pause
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  // Play next song in queue
  const playNext = () => {
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIndex);
    setCurrentSong(queue[nextIndex]);
    setIsPlaying(true);
  };

  // Play previous song in queue
  const playPrev = () => {
    if (queue.length === 0) return;
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIndex);
    setCurrentSong(queue[prevIndex]);
    setIsPlaying(true);
  };

  return (
    <PlayerContext.Provider value={{
      currentSong, isPlaying, queue,
      playSong, togglePlay, playNext, playPrev, audioRef
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);

export default PlayerContext;
