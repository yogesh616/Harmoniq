// Player.jsx
import React, { useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaBackward, FaForward, FaVolumeUp } from 'react-icons/fa';
import { MdOutlineArrowBack, MdMoreVert } from 'react-icons/md';
import { useLocation, Link } from 'react-router-dom';
import { usePlayer } from '../Context/Context';
import './player.css';

const Player = () => {
  const location = useLocation();
  const { state } = location;
  const audioRef = useRef(new Audio());
  const { isPlaying, togglePlayPause, setIsPlaying } = usePlayer();
 

  const {
    title = 'Song Title',
    name = 'Artist Name',
    albumArt = 'https://via.placeholder.com/300',
    downloadUrl = ''
  } = state || {};

  const [progress, setProgress] = React.useState(0);
  const [volume, setVolume] = React.useState(100);

  useEffect(() => {
    if (downloadUrl) {
      audioRef.current.src = downloadUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [downloadUrl, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      console.log(isPlaying)
      audioRef.current.play();
    } else {
      audioRef.current.play();
      audioRef.current.pause();
      console.log(isPlaying)
    }
  }, [isPlaying]);

  useEffect(() => {
    const updateProgress = () => {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((currentTime / duration) * 100);
      }
    };

    audioRef.current.addEventListener('timeupdate', updateProgress);
    return () => {
      audioRef.current.removeEventListener('timeupdate', updateProgress);
    };
  }, []);

  const handlePlayPause = () => {
    togglePlayPause();
  };

  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    setProgress(newProgress);
    const newTime = (audioRef.current.duration / 100) * newProgress;
    audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume / 100;
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen px-4 py-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md">
        <Link to="/">
          <MdOutlineArrowBack size={24} className="cursor-pointer" />
        </Link>
        <h3 className="text-lg font-semibold">Now Playing</h3>
        <MdMoreVert size={24} className="cursor-pointer" />
      </div>

      {/* Album Art */}
      <div className="flex items-center justify-center w-full max-w-md my-8">
        <img
          src={albumArt}
          alt="Album Art"
          className="rounded-lg shadow-lg w-72 h-72"
        />
        <div className="flex items-center justify-center mt-6 space-x-4">
          <label className="slider">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="level"
            />
          </label>
        </div>
      </div>

      {/* Song Details */}
      <div className="text-center">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-gray-500">{name}</p>
      </div>

      {/* Music Progress Bar */}
      <div className="w-full max-w-md mt-6">
        <div className="flex items-center justify-between px-4">
          <span className="text-xs">
            {Math.floor(audioRef.current.currentTime / 60)}:{Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0')}
          </span>
          <span className="text-xs">
            {Math.floor(audioRef.current.duration / 60)}:{Math.floor(audioRef.current.duration % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="relative w-full px-4 my-4">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none thumb"
            style={{
              background: `linear-gradient(to right, #fad0c4 ${progress}%, #e5e7eb ${progress}%)`,
            }}
          />
        </div>
      </div>

      {/* Music Controls */}
      <div className="w-full max-w-md mt-6">
        <div className="flex items-center justify-center mt-6 space-x-10">
          <FaBackward size={24} className="cursor-pointer" />
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white"
          >
            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
          </button>
          <FaForward size={24} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Player;
