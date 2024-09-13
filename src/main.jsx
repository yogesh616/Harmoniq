import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Player from './components/Player.jsx'
import { PlayerProvider } from './Context/Context.jsx'
createRoot(document.getElementById('root')).render(
  <PlayerProvider>
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/player" element={<Player />} />
  </Routes>
  </BrowserRouter>
  </PlayerProvider>
)
