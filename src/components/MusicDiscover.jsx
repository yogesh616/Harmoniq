import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaPlay, FaPause, FaHeadphones, FaHeart as FaHeartRegular, FaHeart as FaHeartSolid} from 'react-icons/fa';
import { MdOutlineVolumeOff, MdOutlineVolumeUp } from "react-icons/md";
import { usePlayer } from '../Context/Context';
import Loader from './Loader';
import './player.css'
import TopArtist from './TopArtist';
import AppDrawer from './AppDrawer';
import axios from 'axios';
import musicPng from '../assets/music.png'
import './flip.css';
import * as Tone from "tone";
import Lottie from 'react-lottie'
import person from '../assets/person.json'


import box from '../assets/box.json'
import Sleep from './Sleep';


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
  const {musicDuration, currentTime, setMusicDuration, setCurrentTime,  audioRef, isPlaying, setIsPlaying, playSong, Latest, isOpen, toggleDrawer, TopArtists, isArtistOpen, toggleArtistDrawer, isCategoryOpen, toggleCategoryDrawer } = usePlayer();
  const [isLoading, setIsLoading] = useState(false);
   const [progress, setProgress] = useState(0)
  const [category, setCategory] = useState('hindi');
  const [categoryData, setCategoryData] = useState([]);
  const [CategorySongs, setCategorySongs] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [bass, setBass] = useState(0);    // Low frequencies
  const [mid, setMid] = useState(0);      // Mid frequencies
  const [treble, setTreble] = useState(0);
  const [player, setPlayer] = useState(null);
  const [eq, setEq] = useState(null);
  const [songUrl, setSongUrl] = useState(null);

  

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: box,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  // implimenting dark mode
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage to see if dark mode is already enabled
    const savedMode = localStorage.getItem('dark-mode');
    return savedMode === 'true' || false;
  });

  // Toggle dark mode class on the root html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save the user's preference in localStorage
    localStorage.setItem('dark-mode', darkMode);
  }, [darkMode]);

    const reset = () => {
      setBass(0);
      setMid(0);
      setTreble(0);
      stopPlayback()
    }

  const handleMuteToggle = () => {
    setIsMuted(prev => {
        audioRef.current.muted = !prev; // Set the muted value based on the updated state
        return !prev;
    });
}
useEffect(() => {
  const handleEnded = () => {
    setIsPlaying(false);
    // Additional logic like playing the next song could go here
   // setIsPlaying(true);
   audioRef.current.play();
    setIsPlaying(true);
  };

  audioRef.current.addEventListener('ended', handleEnded);

  // Cleanup event listener on component unmount
  return () => {
    audioRef.current.removeEventListener('ended', handleEnded);
  };
}, [audioRef.current]);


useEffect(() => {
  const handleLoadedMetadata = () => {
    setMusicDuration(audioRef.current.duration);  // Set the total duration
  };

  audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

  return () => {
    audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
  };
}, [audioRef.current]);

useEffect(() => {
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);  // Update the played time
  };

  audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

  return () => {
    audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
  };
}, [audioRef.current]);


const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};




  useEffect(() => {
    getData();
    setActiveTab('Songs')
  }, [searchQuery]);

  useEffect(() => {
    const handleEnded = () => {
      setIsPlaying(false);
      // Additional logic like playing the next song could go here
     // setIsPlaying(true);
     audioRef.current.play();
      setIsPlaying(true);
    };
  
    audioRef.current.addEventListener('ended', handleEnded);
  
    // Cleanup event listener on component unmount
    return () => {
      audioRef.current.removeEventListener('ended', handleEnded);
    };
  }, [audioRef.current]);
  
  
    useEffect(() => {
      getData();
      setActiveTab('Songs')
    }, [searchQuery]);
  
    useEffect(() => {
      if (isPlaying && currentSong) {
        audioRef.current.src = currentSong.downloadUrl;
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
  
   
  
    const handleSongClick = (song) => {
      const formattedSong = {
        title: song.name,
        name: song.primaryArtists,
        albumArt: song.image[2].link,
        downloadUrl: song.downloadUrl[2].link,  // Ensure this link exists
      };
    
      setCurrentSong(formattedSong);  // Set the new song
      playSong(formattedSong);  // Start playing the song
      setIsPlayerVisible(true);  // Show the player UI
      setSongUrl(formattedSong.downloadUrl);
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
    setSongUrl(currentSong.downloadUrl)
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
 
useEffect(() => {
  handleCategories('hindi');
}, [])


useEffect(() => {
  if (songUrl) {
    // Dispose of the previous player if it exists
    if (player) {
      player.dispose();
    }

    // Create a new Tone.Player for the new song URL
    const newPlayer = new Tone.Player({
      url: songUrl,
      autostart: false,  // Start playback manually
    }).toDestination();

    // Create a new EQ3 for bass, mid, and treble
    const newEq = new Tone.EQ3({
      low: bass,
      mid: mid,
      high: treble,
    }).toDestination();

    // Connect the player to the EQ and set up state
    newPlayer.connect(newEq);
    setPlayer(newPlayer);
    setEq(newEq);

    // Cleanup on unmount or URL change
    return () => {
      newPlayer.dispose();
      newEq.dispose();
    };
  }
}, [songUrl]);
 
useEffect(() => {
  if (eq) {
    eq.low.value = bass;
    eq.mid.value = mid;
    eq.high.value = treble;
  }
}, [bass, mid, treble, eq]);

// Start playback when a song is played
const startPlayback = async () => {
  await Tone.start();
  player.start();  // Ensure the new player is used here
  setIsPlaying(true);
};

// Stop playback
const stopPlayback = () => {
  if (player) {
    player.stop();
    setIsPlaying(false);
  }
};


const handleDownload = (song) => {
  const fileUrl = song.downloadUrl;
  

  fetch(fileUrl)
      .then(response => response.blob())
      .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = song.title; // Use the original file name
          document.body.appendChild(a);
          a.click();
          a.remove();
      })
      .catch(err => console.error('Error downloading the file:', err));
};





  return (
    <div className="flex flex-col items-center justify-between min-h-screen px-4 py-6 bg-gray-50 dark:text-slate-400 dark:bg-zinc-900">
     
      <div className="w-full max-w-md">
      <div className="one">
  <div className="two">
    <a href='/' className='logo cursor-pointer'>Syncy</a>
    
    <button
          onClick={() => setDarkMode(!darkMode)}
          className="border-0 rounded px-4 py-2 text-sm font-medium text-white bg-indigo-600  dark:bg-slate-800 dark:text-yellow-400 transition-all duration-300"
        >
          {darkMode ? (<i className="fa-regular fa-sun"></i>) : (<i className="fa-solid fa-moon"></i>)}
        </button>
    <div className="words">
      <span className="word">beats</span>
      <span className="word">melodies</span>
      <span className="word">tracks</span>
      <span className="word">albums</span>
      <span className="word">playlists</span>
      <span className="word">songs</span>
      <span className="word">artists</span>
      <span className="word">vibes</span>
      <span className="word">genres</span>
      <span className="word">remixes</span>
    </div>
    { currentSong && <div onClick={()=> setIsPlayerVisible(!isPlayerVisible)} className='cursor-pointer border-0 player-btn px-4 py-2 text-sm font-medium text-white bg-indigo-600'><i  className="fa-solid fa-headphones cursor-pointer"></i>
    </div>}
  </div>
</div>

        <div className="flex items-center mt-4 mb-8 bg-gray-100 rounded-full dark:text-slate-400 dark:bg-zinc-900">
          <FaTimes onClick={handleSearch} className="w-5 h-5 ml-3 text-gray-500 cursor-pointer" />
          <input
            type="text"
            value={searchQuery}
		  onFocus={() => setIsPlayerVisible(false)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full py-2 pl-4 pr-4 text-sm bg-gray-100 rounded-full focus:outline-none"
          />
          <FaHeadphones onClick={()=> setIsPlayerVisible(!isPlayerVisible)} className='cursor-pointer' />
        </div>
        <div className="flex items-center justify-between w-full pb-2 mb-4 text-sm font-semibold border-b overflow-x-auto dark:text-slate-400 dark:bg-zinc-900">
          <span
            onClick={() =>{ setActiveTab('Songs'); setIsPlayerVisible(false)} }
            className={`cursor-pointer ${activeTab === 'Songs' ? 'border-b-2 border-yellow-400' : 'text-gray-400 hover:text-gray-800'}`}
          >
            Songs
          </span>
          
          <span
            onClick={() => {setActiveTab('Favorite'); setIsPlayerVisible(false); setTimeout(() => toggleDrawer(), 200)}}
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
          <div className="mb-12 ">
            <h3 className="mb-4 text-lg font-semibold">Latest Songs</h3>
            <div className="overflow-x-auto">
  <div className="flex gap-4 mb-10">
    {Latest.length > 0 ? Latest.map((song, index) => (
      <div key={index} className="min-w-[130px]">
        <div className="relative cursor-pointer" onClick={() => handleSongClick(song)}>
          <img
            src={song.image[2].link}
            alt="Popular Song"
            className="rounded-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center w-full bg-gray-900 bg-opacity-50 h-9 rounded-b-lg">
            <button
              onClick={() => togglePlayPause(song.downloadUrl[2].link)}
              className="text-gray-400 cursor-pointer"
            >
              {isPlaying && audioRef.current.src === song.downloadUrl[2].link ? <FaPause /> : <FaPlay />}
            </button>
          </div>
        </div>
      </div>
    )) : <Loader />}
  </div>
</div>
            <ul className="space-y-4 ">
              {songs.length > 0 ? songs.map((song, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 bg-white rounded-lg shadow dark:text-slate-400 dark:bg-zinc-900 custom"
                  
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
                        <span className='cursor-pointer' onClick={(e) => { e.stopPropagation(); handleFavorite(song); }}>
                          {isSongFavorite(song.id) ? <FaHeartSolid color="red" /> : <FaHeartRegular />}
                        </span>

                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {togglePlayPause(song.downloadUrl[2].link), handleSongClick(song)}}
                    className="text-gray-400 cursor-pointer"
                  >
                    {isPlaying && audioRef.current.src === song.downloadUrl[2].link ? <FaPause /> : <FaPlay />}
                  </button>
                </li>
              )) : <Loader />}
            </ul>
          </div>
        )}
        {activeTab === 'Latest' && (
          <div>
            <h3 className="mb-4 text-lg font-semibold">Popular This Week</h3>
            <div className="overflow-x-auto">
  <div className="flex gap-4 mb-10">
    {Latest.length > 0 ? Latest.map((song, index) => (
      <div key={index} className="min-w-[200px] ">
        <div className="relative cursor-pointer" onClick={() => handleSongClick(song)}>
          <img
            src={song.image[2].link}
            alt="Popular Song"
            className="rounded-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center w-full bg-gray-900 bg-opacity-50 h-9 rounded-b-lg">
            <button
              onClick={() => togglePlayPause(song.downloadUrl[2].link)}
              className="text-gray-400 cursor-pointer"
            >
              {isPlaying && audioRef.current.src === song.downloadUrl[2].link ? <FaPause /> : <FaPlay />}
            </button>
          </div>
        </div>
      </div>
    )) : <Loader />}
  </div>
</div>

          </div>
        )}
        {activeTab === 'Favorite' && (
          <div>
            <h3 className="mb-4 text-lg font-semibold cursor-pointer" onClick={toggleDrawer}>Favorites <i className="fa-solid fa-star " style={{color: '#fcd34d'}}></i></h3>
            <svg className="animate-bounce w-6 h-6 ...">
  
</svg>
  
        
            <div className={`app-drawer dark:text-slate-400 dark:bg-zinc-900 ${isOpen ? 'open' : ''}`}>
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
        <h2 className='heart-beat dark:text-slate-400 dark:bg-zinc-900'>Heart Beats</h2>
        <ul className='song-list'>
          {favorite.length > 0 ? favorite.map((song, index) => (
             <li
             key={index}
             className="flex items-center justify-between p-2 bg-white rounded-lg shadow cursor-pointer dark:text-slate-400 dark:bg-zinc-900"
             
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
                    onClick={() => togglePlayPause(song.downloadUrl[2].link)}
                    className="text-gray-400 cursor-pointer"
                  >
                    {isPlaying && audioRef.current.src === song.downloadUrl[2].link ? <FaPause /> : <FaPlay />}
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
            <div className='w-full'>
            <div className={`app-drawer z-50 dark:text-slate-400 dark:bg-zinc-900 ${isArtistOpen ? 'open' : ''}`}>
      <span className='backButton ' onClick={toggleArtistDrawer}><i className="fa-solid fa-chevron-down"></i></span>
      
<button className="button hidden" onClick={toggleArtistDrawer}>
  <svg className="svgIcon" viewBox="0 0 384 512">
    <path
      d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
    ></path>
  </svg>
</button>

      
      <div className="drawer-handle " onClick={toggleArtistDrawer}>
        <span className="handle-bar"></span>
      </div>
      <div className="app-list">
        <h2>Heart Beats</h2>
        <ul className='song-list'>
          {artistSongs.length > 0 ? artistSongs.map((song, index) => (
             <li
             key={index}
             className="flex items-center justify-between p-2 bg-white rounded-lg shadow cursor-pointer dark:text-slate-400 dark:bg-zinc-900"
             
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
                  {/* add to favorite */}
                  <span className='cursor-pointer' onClick={(e) => { e.stopPropagation(); handleFavorite(song); }}>
                          {isSongFavorite(song.id) ? <FaHeartSolid color="red" /> : <FaHeartRegular />}
                        </span>
                 </p>
               </div>
             </div>
             <button
                    onClick={() => togglePlayPause(song.downloadUrl[2].link)}
                    className="text-gray-400 cursor-pointer"
                  >
                    {isPlaying && audioRef.current.src === song.downloadUrl[2].link ? <FaPause /> : <FaPlay />}
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
             <div className="flex items-center justify-center h-full  mx-auto" >
               <button   className="animatedButton mx-0.5 " onClick={() => handleCategories('hindi')}>Hindi</button>
               <button className="animatedButton mx-0.5" onClick={() => handleCategories('english')}>English</button>
               <button className="animatedButton mx-0.5" onClick={() => handleCategories('punjabi')}>Punjabi</button>
               <button className="animatedButton mx-0.5" onClick={() => handleCategories('haryanvi')}>Haryanvi</button>
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
        <div className={`app-drawer z-50 dark:text-slate-400 dark:bg-zinc-900 ${isCategoryOpen ? 'open' : ''}`}>
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
  <div className='app-list'>
   
    <ul className='song-list'>
    
      {CategorySongs.length > 0 ? (
        CategorySongs.map((song, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 bg-white rounded-lg shadow cursor-pointer dark:text-slate-400 dark:bg-zinc-900"
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
                  <span onClick={(e) => { e.stopPropagation(); handleFavorite(song); }}>
                          {isSongFavorite(song.id) ? <FaHeartSolid color="red" /> : <FaHeartRegular />}
                        </span>
                </p>
              </div>
            </div>

            <button
              onClick={() => togglePlayPause(song.downloadUrl[2].link)}
              className="text-gray-400 cursor-pointer"
            >
              {isPlaying && audioRef.current.src === song.downloadUrl[2].link ? (
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
        <div style={{zIndex: '1002'}} className="fixed bottom-0 w-full max-w-md px-4 bg-white rounded-t-xl shadow-md dark:text-slate-400 dark:bg-zinc-900">
        <div className="flex flex-col items-center py-4">
          <div className="flip-card w-72 h-72 rounded-lg shadow-lg">
            <div
              className={`flip-card-inner w-72 h-72 rounded-lg shadow-lg ${
                isFlipped ? "rotate" : "rotate-back"
              }`}
            >
              {/* Front of the flip card */}
              <div
                className="flip-card-front w-72 h-72 rounded-lg shadow-lg"
                onClick={() => setIsFlipped(true)}
              >
               
               
                <img
                  src={currentSong.albumArt}
                  alt="Album Art"
                  className="w-100 h-100 rounded-lg shadow-lg img cursor-pointer"
                />
              </div>
  
              {/* Back of the flip card */}
              <div className="flip-card-back w-72 h-72 rounded-lg shadow-lg">
                <button onClick={reset} className='bg-slate-700 px-2 py-1 my-2 rounded-lg'>Reset</button>
              <div className="flex  items-center justify-center  w-70 h-1/3 z-20">
               <div className="Slider">
	               <input className="level" type="range" min="-40" max="10" value={bass} onChange={(e) => setBass(Number(e.target.value))}   />
               </div>
               <div className="Slider">
	               <input className="level" type="range" min="-40" max="10" value={mid} onChange={(e) => setMid(Number(e.target.value))}  />
               </div>
               <div className="Slider">
	               <input className="level" type="range" min="-40" max="10" value={treble} onChange={(e) => setTreble(Number(e.target.value))}  />
               </div>
              </div>
                {/* Back Button to flip the card back to the front */}
                <button
                  onClick={() => setIsFlipped(false)}
                  className="mt-4 px-4 py-2 rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700"
                >
                  Back to Front
                </button>
              </div>
            </div>
          </div>
  
          {/* Song details */}
        <div className='flex items-center justify-center w-2/3 m-1 mt-2'> 
        {/*  <Sleep />*/}
         <button onClick={() => handleDownload(currentSong)}>Download</button>
         
         </div>
         
          <h3 className="text-2xl font-bold">{currentSong.title}</h3>
          <p className="text-gray-500">{currentSong.name}</p>
  
          {/* Controls */}
          <div className="flex justify-between w-full mt-4">
            <button
              onClick={() => setIsPlayerVisible(false)}
              className="w-10 h-10 rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700 ml-2"
            >
              <i className="fa-solid fa-hand"></i>
            </button>
  
            <button
              style={{ paddingLeft: "12px" }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700"
            >
              {isPlaying ?   <FaPause /> : <FaPlay />}
            </button>
  
            {/* Volume button */}
            <button
              style={{ paddingLeft: "12px" }}
              onClick={handleMuteToggle}
              className="w-10 h-10 rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700"
            >
              {isMuted ? <MdOutlineVolumeOff /> : <MdOutlineVolumeUp />}
            </button>
          </div>
  
          {/* Progress bar */}
          
          <label className="w-full flex mt-2 items-center justify-center gap-1 px-1">
          <span className='currentTime'>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="w-10/12 h-1 bg-gray-200 rounded-lg appearance-none thumb cursor-pointer"
              style={{
                background: `linear-gradient(to right, #fad0c4 ${progress}%, #e5e7eb ${progress}%)`,
              }}
            />
            <span className='musicDuration'>{formatTime(musicDuration)}</span>
          </label>
          
        </div>
      </div>
      )}
    </div>
  );
};

export default MusicDiscover;
