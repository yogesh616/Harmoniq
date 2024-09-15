import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaPlay, FaPause, FaHeadphones, FaHeart as FaHeartRegular, FaHeart as FaHeartSolid} from 'react-icons/fa';
import { usePlayer } from '../Context/Context';
import Loader from './Loader';
import './player.css'
import TopArtist from './TopArtist';
import AppDrawer from './AppDrawer';
import axios from 'axios';
const MusicDiscover = () => {
  const [searchQuery, setSearchQuery] = useState('mitraz');
  const [songs, setSongs] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('Songs');
  const [searchArtist, setSearchArtist] = useState('');
  const [artistSongs, setArtistSongs] = useState([]);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const { isPlaying, setIsPlaying, playSong, Latest, isOpen, toggleDrawer, TopArtists, isArtistOpen, toggleArtistDrawer, isCategoryOpen, toggleCategoryDrawer } = usePlayer();
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(new Audio());
  const [category, setCategory] = useState('hindi');
  const [categoryData, setCategoryData] = useState([]);
  const [CategorySongs, setCategorySongs] = useState([]);





  useEffect(() => {
    getData();
    setActiveTab('Songs')
  }, [searchQuery]);

  useEffect(() => {
    if (isPlaying && currentSong) {
      audioRef.current.src = currentSong.downloadUrl[3].link;
      audioRef.current.play().catch((error) => console.error('Error playing audio:', error));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0;
      setProgress(progress);
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentSong]);

  const [progress, setProgress] = useState(0);

  const handleSongClick = (song) => {
    setCurrentSong({
      name: song.name,
      primaryArtists: song.primaryArtists,
      image: song.image,
      downloadUrl: song.downloadUrl,
      id: song.id,
      album: song.album,

    });
    playSong();
    setIsPlayerVisible(true);
    
  };

  async function getData() {
    try {
      const response  = await axios.get(`https://jiosaavn-api-privatecvc2.vercel.app/search/songs?query=${searchQuery}&limit=20&page=1`);
      const data = await response.data;
      const formattedSongs = data.data.results.map((song) => ({
        ...song,
        formattedDuration: formatDuration(song.duration),
      }));
      setSongs(formattedSongs);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  }

  const handleSearch = () => {
    setSearchQuery('')
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} min`;
  };

  const togglePlayPause = (url) => {
    if (isPlaying && audioRef.current.src === url) {
      setIsPlaying(false);
    } else {
      setCurrentSong({
        ...currentSong,
        downloadUrl: url,
      });
      playSong();
      setIsPlaying(true);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };
 // Load favorite songs from localStorage on component mount
 useEffect(() => {
  try {
    const storedFavorites = localStorage.getItem('favoriteSongs');
    const favoriteSongs = storedFavorites ? JSON.parse(storedFavorites) : [];
    setFavorite(favoriteSongs);
  } catch (error) {
    console.error('Error parsing favorite songs from localStorage:', error);
    setFavorite([]);
  }
}, []);

useEffect(() => {
  if (currentSong) {
    const isSongFavorite = favorite.some(fav => fav.id === currentSong.id);
    setIsFavorite(isSongFavorite);
  }
}, [currentSong, favorite]);

const handleFavorite = (song) => {
  try {
    const storedFavorites = localStorage.getItem('favoriteSongs');
    const favoriteSongs = storedFavorites ? JSON.parse(storedFavorites) : [];
    const isAlreadyFavorite = favoriteSongs.some(fav => fav.id === song.id);

    const updatedFavorites = isAlreadyFavorite
      ? favoriteSongs.filter(fav => fav.id !== song.id)
      : [...favoriteSongs, song];

    localStorage.setItem('favoriteSongs', JSON.stringify(updatedFavorites));
    setFavorite(updatedFavorites);
    setIsFavorite(!isAlreadyFavorite); // Toggle the state
  } catch (error) {
    console.error('Error handling favorite status:', error);
  }
};
const isSongFavorite = (songId) => {
  return favorite.some(fav => fav.id === songId);
};

async function getArtistSongs(search) {
  try {
    setIsLoading(true);
    const response = await axios.get(`https://jiosaavn-api-privatecvc2.vercel.app/search/songs?query=${search}&limit=20&page=1`);
    const data = await response.data;
    setArtistSongs(data.data.results)
    setIsLoading(false);
  } catch (error) {
    console.error("Error fetching songs:", error);
    setArtistSongs([]);
    setIsLoading(false);
  }
}

async function handleCategories(category) {
  try {
    const res = await axios.get(`https://jiosaavn-api-privatecvc2.vercel.app/modules?language=${category}`)
    const data = await res.data;
    setCategoryData(data.data.charts);
  }
  catch (error) {
    console.error('Error fetching categories:', error);
  }
}



async function getCategorySongs(id) {
  try {
    setIsLoading(true);
    const res = await axios.get(`https://jiosaavn-api-privatecvc2.vercel.app/playlists?id=${id}`)
    const data = await res.data;
    setCategorySongs(data.data.songs)
    setIsLoading(false);
  }
  catch (error) {
    console.error('Error fetching category songs:', error);
  }
}






  return (
    <div className="flex flex-col items-center justify-between min-h-screen px-4 py-6 bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold logo">Syncy </h1>
        <div className="flex items-center mt-4 mb-8 bg-gray-100 rounded-full">
          <FaTimes onClick={handleSearch} className="w-5 h-5 ml-3 text-gray-500 cursor-pointer" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full py-2 pl-4 pr-4 text-sm bg-gray-100 rounded-full focus:outline-none"
          />
          <FaHeadphones onClick={()=> setIsPlayerVisible(!isPlayerVisible)} className='cursor-pointer' />
        </div>
        <div className="flex items-center justify-between w-full pb-2 mb-4 text-sm font-semibold border-b overflow-x-auto">
          <span
            onClick={() =>{ setActiveTab('Songs'); setIsPlayerVisible(false)} }
            className={`cursor-pointer ${activeTab === 'Songs' ? 'border-b-2 border-yellow-400' : 'text-gray-400 hover:text-gray-800'}`}
          >
            Songs
          </span>
          <span
            onClick={() => {setActiveTab('Latest'); setIsPlayerVisible(false)} }
            className={`cursor-pointer ${activeTab === 'Latest' ? 'border-b-2 border-yellow-400' : 'text-gray-400 hover:text-gray-800'}`}
          >
            Latest
          </span>
          <span
            onClick={() => {setActiveTab('Favorite'); setIsPlayerVisible(false)}}
            className={`cursor-pointer ${activeTab === 'Favorite' ? 'border-b-2 border-yellow-400' : 'text-gray-400 hover:text-gray-800'}`}
          >
            Favorite
          </span>
          <span
            onClick={() => {setActiveTab('Artists'),  setIsPlayerVisible(false)} }
            className={`cursor-pointer ${activeTab === 'Artists' ? 'border-b-2 border-yellow-400' : 'text-gray-400 hover:text-gray-800'}`}
          >
            Artists
          </span>
          <span
            onClick={() => {setActiveTab('Categories'),  setIsPlayerVisible(false)} }
            className={`cursor-pointer ${activeTab === 'Categories' ? 'border-b-2 border-yellow-400' : 'text-gray-400 hover:text-gray-800'}`}
          >
            Categories
          </span>
          
        </div>
        {activeTab === 'Songs' && (
          <div className="mb-12">
            <h3 className="mb-4 text-lg font-semibold">Top Songs</h3>
            <ul className="space-y-4">
              {songs.length > 0 ? songs.map((song, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 bg-white rounded-lg shadow "
                  
                >
                  <div className="flex items-center" >
                    <img
                      src={song.image[0].link}
                      alt={song.title}
                      className="w-10 h-10 rounded-lg cursor-pointer"
                     
                    />
                    <div className="ml-3">
                      <h4 className="text-base font-semibold cursor-pointer" onClick={() => handleSongClick(song)}>{song.name}</h4>
                      <p className="text-sm text-gray-500">
                        {song.primaryArtists} &nbsp; &nbsp;
                        <span className="text-sm text-gray-400">
                          {song.formattedDuration}
                        </span> &nbsp; &nbsp; &nbsp; &nbsp;
                        <span onClick={(e) => { e.stopPropagation(); handleFavorite(song); }}>
                          {isSongFavorite(song.id) ? <FaHeartSolid color="red" /> : <FaHeartRegular />}
                        </span>

                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {togglePlayPause(song.downloadUrl[3].link), handleSongClick(song)}}
                    className="text-gray-400 cursor-pointer"
                  >
                    {isPlaying && audioRef.current.src === song.downloadUrl[3].link ? <FaPause /> : <FaPlay />}
                  </button>
                </li>
              )) : <Loader />}
            </ul>
          </div>
        )}
        {activeTab === 'Latest' && (
          <div>
            <h3 className="mb-4 text-lg font-semibold">Popular This Week</h3>
            <div className="grid grid-cols-2 gap-4 mb-10 md:grid-cols-1 md:gap-8">
              {Latest.length > 0 ? Latest.map((song, index) => (
                <div key={index}>
                  <div className="relative grid-rows-2 cursor-pointer"  onClick={() => handleSongClick(song)}>
                    <img
                      src={song.image[2].link}
                      alt="Popular Song"
                      className="rounded-lg"
                    />
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center w-full bg-gray-900 bg-opacity-50 h-9 rounded-b-lg">
                      <button
                        onClick={() => togglePlayPause(song.downloadUrl[3].link)}
                        className="text-gray-400 cursor-pointer"
                      >
                        {isPlaying && audioRef.current.src === song.downloadUrl[3].link ? <FaPause /> : <FaPlay />}
                      </button>
                    </div>
                  </div>
                </div>
              )) : <Loader />}
            </div>
          </div>
        )}
        {activeTab === 'Favorite' && (
          <div>
            <h3 className="mb-4 text-lg font-semibold cursor-pointer" onClick={toggleDrawer}>Favorites <i className="fa-solid fa-star " style={{color: '#fcd34d'}}></i></h3>
            <svg className="animate-bounce w-6 h-6 ...">
  
</svg>
            <div className={`app-drawer ${isOpen ? 'open' : ''}`}>
      <span className='backButton ' onClick={toggleDrawer}><i className="fa-solid fa-chevron-down"></i></span>
      
<button className="button hidden" onClick={toggleDrawer}>
  <svg className="svgIcon" viewBox="0 0 384 512">
    <path
      d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
    ></path>
  </svg>
</button>

      
      <div className="drawer-handle" onClick={toggleDrawer}>
        <span className="handle-bar"></span>
      </div>
      <div className="app-list">
        <h2 className='heart-beat'>Heart Beats</h2>
        <ul className='song-list'>
          {favorite.length > 0 ? favorite.map((song, index) => (
             <li
             key={index}
             className="flex items-center justify-between p-2 bg-white rounded-lg shadow cursor-pointer"
             
           >
             <div className="flex items-center" onClick={() => handleSongClick(song)}>
               <img
                 src={song.image[0].link}
                 alt={song.title}
                 className="w-10 h-10 rounded-lg cursor-pointer"
                
               />
               <div className="ml-3">
                 <h4 className="text-base font-semibold" >{song.name}</h4>
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
                    {isPlaying && audioRef.current.src === song.downloadUrl[3].link ? <FaPause /> : <FaPlay />}
                  </button>

           </li>
          )) : <Loader />}
        </ul>
      </div>
    </div>
          </div>
        )}
        {activeTab === 'Artists' && (
          <div>
            <h3 className="mb-4 text-lg font-semibold" > Top Artists</h3>
            <div>

            {TopArtists.length > 0 ? (
                <section 
                    className='grid grid-cols-2 gap-4 mb-10 md:grid-cols-2 md:gap-8 lg:grid-cols-5 lg:grid-rows-2'>
                    {TopArtists.map((artist, index) => (
                        <div key={index} className='relative flex flex-col items-center'>
                            {/* Artist Image with Play Button Overlay */}
                            <div className='relative group cursor-pointer' onClick={() => {getArtistSongs(artist.name); toggleArtistDrawer();}} >
                                <img 
                                    src={artist.image[2].link} 
                                    alt={artist.name} 
                                    className='w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-auto rounded-full object-cover'
                                    
                                   
                                />
                                {/* Play Button Overlay */}
                                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-full'>
                                    <button className='text-white text-2xl'>▶</button>
                                </div>
                               
                            </div>
                            {/* Artist Name */}
                            <span className='mt-2 text-sm font-semibold text-center'  >{artist.name}</span>
                        </div>
                    ))}
                </section>
            ) : (
                <Loader />
            )}
            </div>
            {/* Artist Drawer */}
            <div>
            <div className={`app-drawer z-50 ${isArtistOpen ? 'open' : ''}`}>
      <span className='backButton ' onClick={toggleArtistDrawer}><i className="fa-solid fa-chevron-down"></i></span>
      
<button className="button hidden" onClick={toggleArtistDrawer}>
  <svg className="svgIcon" viewBox="0 0 384 512">
    <path
      d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
    ></path>
  </svg>
</button>

      
      <div className="drawer-handle" onClick={toggleArtistDrawer}>
        <span className="handle-bar"></span>
      </div>
      <div className="app-list">
        <h2>Heart Beats</h2>
        <ul className='song-list'>
          {artistSongs.length > 0 ? artistSongs.map((song, index) => (
             <li
             key={index}
             className="flex items-center justify-between p-2 bg-white rounded-lg shadow cursor-pointer"
             
           >
             <div className="flex items-center" onClick={() => handleSongClick(song)}>
               <img
                 src={song.image[0].link}
                 alt={song.title}
                 className="w-10 h-10 rounded-lg cursor-pointer"
                
               />
               <div className="ml-3">
                 <h4 className="text-base font-semibold" >{song.name}</h4>
                 <p className="text-sm text-gray-500">
                   {song.primaryArtists} &nbsp; &nbsp;
                   <span className="text-sm text-gray-400">
                     {song.formattedDuration}
                   </span> &nbsp; &nbsp; &nbsp; &nbsp;
                  
                 </p>
               </div>
             </div>
             <button
                    onClick={() => togglePlayPause(song.downloadUrl[3].link)}
                    className="text-gray-400 cursor-pointer"
                  >
                    {isPlaying && audioRef.current.src === song.downloadUrl[3].link ? <FaPause /> : <FaPlay />}
                  </button>

           </li>
          )) : <Loader />}
        </ul>
      </div>
    </div>
            </div>
          </div>
        )}
        {activeTab == 'Categories' && (
          <div>
             <h3 className="mb-4 text-lg font-semibold" > Find Categories</h3>
             <div className="flex items-center justify-center h-full w-11/12 mx-auto">
               <button   className="animatedButton mx-1 " onClick={() => handleCategories('hindi')}>Hindi</button>
               <button className="animatedButton mx-1" onClick={() => handleCategories('english')}>English</button>
               <button className="animatedButton mx-1" onClick={() => handleCategories('punjabi')}>Punjabi</button>
               <button className="animatedButton mx-1 me-1" onClick={() => handleCategories('haryanvi')}>Haryanvi</button>
           </div>

           {categoryData.length > 0 && (
                <section 
                    className='  grid grid-cols-2  gap-4 mb-10 md:grid-cols-2 md:gap-8 lg:grid-cols-5 lg:grid-rows-2'>
                    {categoryData.map((chart, index) => (
                        <div key={index} className='relative flex flex-col items-center mt-3'>
                            {/* Artist Image with Play Button Overlay */}
                            <div className='relative group cursor-pointer' onClick={() => { getCategorySongs(chart.id); toggleCategoryDrawer();}} >
                                <img 
                                    src={chart.image[2].link} 
                                    alt={chart.name} 
                                    className='w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-auto rounded-full object-cover'
                                    
                                   
                                />
                                {/* Play Button Overlay */}
                                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-full'>
                                    <button className='text-white text-2xl'>▶</button>
                                </div>
                               
                            </div>
                            {/* Artist Name */}
                            <span className='mt-2 text-sm font-semibold text-center'  >{chart.title}</span>
                        </div>
                    ))}
        <div className={`app-drawer z-50 ${isCategoryOpen ? 'open' : ''}`}>
  {/* Back Button */}
  <span className='backButton' onClick={toggleCategoryDrawer}>
    <i className="fa-solid fa-chevron-down"></i>
  </span>

  {/* Drawer Toggle Button */}
  <button className="button hidden" onClick={toggleCategoryDrawer}>
    <svg className="svgIcon" viewBox="0 0 384 512">
      <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
    </svg>
  </button>

  {/* Drawer Handle */}
  <div className="drawer-handle" onClick={toggleCategoryDrawer}>
    <span className="handle-bar"></span>
  </div>

  {/* Song List */}
  <div className='app-list manualWidth'>
   
    <ul className='song-list'>
    
      {CategorySongs.length > 0 ? (
        CategorySongs.map((song, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 bg-white rounded-lg shadow cursor-pointer"
          >
            <div className="flex items-center" onClick={() => handleSongClick(song)}>
              <img
                src={song.image[0].link}
                alt={song.title}
                className="w-10 h-10 rounded-lg cursor-pointer"
              />
              <div className="ml-3">
                <h4 className="text-base font-semibold">{song.name}</h4>
                <p className="text-sm text-gray-500">
                  {song.primaryArtists} &nbsp; &nbsp;
                  <span className="text-sm text-gray-400">{song.formattedDuration}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => togglePlayPause(song.downloadUrl[3].link)}
              className="text-gray-400 cursor-pointer"
            >
              {isPlaying && audioRef.current.src === song.downloadUrl[3].link ? (
                <FaPause />
              ) : (
                <FaPlay />
              )}
            </button>
          </li>
        ))
      ) : (
        <Loader />
      )}
    </ul>
  </div>
</div>

                </section>
            )}

            </div>
        )}
      </div>

      {/* Player Component */}
      {isPlayerVisible && currentSong && (
        <div className="fixed bottom-0 w-full max-w-md px-4 bg-white rounded-t-xl shadow-md z-50">
          <div className="flex flex-col items-center py-4">
            <img
              src={currentSong.image[2].link}
              alt="Album Art"
              className="w-72 h-72 rounded-lg shadow-lg"
            />
            <h3 className="text-2xl font-bold">{currentSong.title}</h3>
            <p className="text-gray-500">{currentSong.name}</p>
            <div className="flex justify-between w-full mt-4">
              <button style={{paddingLeft: '12px'}}
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10  rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <span onClick={(e) => { e.stopPropagation(); handleFavorite(currentSong); }}>
                          {isSongFavorite(currentSong.id) ? <FaHeartSolid color="red" /> : <FaHeartRegular />}
                        </span>
              <button
                onClick={() => {
                  setIsPlayerVisible(false);
                  { /* setIsPlaying(false); */}
                }}
                className="w-10 ps-1 h-10 rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700 ml-2"
              >
                <i className="fa-solid fa-hand"></i>
              </button>
            </div>
            <label className=''>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none thumb cursor-pointer"
              style={{
                background: `linear-gradient(to right, #fad0c4 ${progress}%, #e5e7eb ${progress}%)`,
              }}
            
            />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicDiscover;
