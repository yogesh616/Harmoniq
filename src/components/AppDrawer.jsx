import React, { useState, useEffect } from 'react';
import './AppDrawer.css'; // Link the CSS file for styling
import Loader from './Loader';
import { usePlayer } from '../Context/Context';
import { FaPause, FaPlay } from 'react-icons/fa';

const AppDrawer = () => {
  const [favorite, setFavorite] = useState([]);
  const { isOpen, toggleDrawer, currentSong, isPlaying, togglePlayPause } = usePlayer(); // Destructure from context


const storedFavorites = localStorage.getItem('favoriteSongs');
  useEffect(() => {
    // Retrieve favorite songs from localStorage
    const favoriteSongs = storedFavorites ? JSON.parse(storedFavorites) :  [];
    if (favoriteSongs.length > 0) {
      // Update state with favorite songs
    setFavorite(favoriteSongs);
    
    }
    
  }, []);
  useEffect(() => {
    console.log('Favorite',  favorite)
  }, [favorite])

  return (
    
    <div className={`app-drawer ${isOpen ? 'open' : ''}`}>
      <span className='backButton' onClick={toggleDrawer}><i className="fa-solid fa-chevron-down"></i></span>
      <div className="drawer-handle" onClick={toggleDrawer}>
        <span className="handle-bar"></span>
      </div>
      <div className="app-list">
        <h2>App Drawer</h2>
        <ul>
          {favorite.length > 0 ? favorite.map((song, index) => (
             <li
             key={index}
             className="flex items-center justify-between p-2 bg-white rounded-lg shadow cursor-pointer"
             
           >
             <div className="flex items-center" >
               <img
                 src={song.image[0].link}
                 alt={song.title}
                 className="w-10 h-10 rounded-lg cursor-pointer"
                
               />
               <div className="ml-3">
                 <h4 className="text-base font-semibold">{song.name}</h4>
                 <p className="text-sm text-gray-500">
                   {song.primaryArtists} &nbsp; &nbsp;
                   <span className="text-sm text-gray-400">
                     {song.formattedDuration}
                   </span> &nbsp; &nbsp; &nbsp; &nbsp;
                   <i className={`fa-heart fa-solid `} style={{ cursor: 'pointer', color: '#dc2626' }}></i>
                 </p>
               </div>
             </div>
             <button
                onClick={() => togglePlayPause(song.downloadUrl[3].link)}
                className="text-gray-400 cursor-pointer"
              >
                {isPlaying && currentSong?.downloadUrl[3].link === song.downloadUrl[3].link ? <FaPause /> : <FaPlay />}
              </button>

           </li>
          )) : <Loader />}
        </ul>
      </div>
    </div>
    
  );
};

export default AppDrawer;
