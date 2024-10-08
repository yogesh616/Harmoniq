import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Player from './components/Player.jsx'
import { PlayerProvider } from './Context/Context.jsx'
import AudioPlayer from './components/AudioPlayer.jsx'
import { SleepProvider } from './Context/AutoSleepContext.jsx'

createRoot(document.getElementById('root')).render(
  <PlayerProvider>
    <SleepProvider>
  
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/player" element={<Player />} />
    <Route path="/audio-player" element={<AudioPlayer />} />
  </Routes>
  </BrowserRouter>
  </SleepProvider>
  </PlayerProvider>
)
