import React, { useState, useEffect, useRef, useCallback } from 'react';
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
//import * as Tone from "tone";
//import Lottie from 'react-lottie'
import person from '../assets/person.json'
import { useSwipeable } from 'react-swipeable';

import box from '../assets/box.json'
import Sleep from './Sleep';
import Animation from './Animation';

let myFavorites = [];



// offline music settings
import { openDB } from 'idb';



const MusicDiscover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('Songs');
  const [searchArtist, setSearchArtist] = useState('');
  const [artistSongs, setArtistSongs] = useState([]);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  
  const {audioQuality, setAudioQuality, pausedTime, setPausedTime, currentSong, setCurrentSong,  musicDuration, currentTime, setMusicDuration, setCurrentTime,  audioRef, isPlaying, setIsPlaying, playSong, Latest, isOpen, toggleDrawer, TopArtists, isArtistOpen, toggleArtistDrawer, isCategoryOpen, toggleCategoryDrawer } = usePlayer();
  const [isLoading, setIsLoading] = useState(false);
   const [progress, setProgress] = useState(0)
  
  const [categoryData, setCategoryData] = useState([]);
  const [CategorySongs, setCategorySongs] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
 
  const [songUrl, setSongUrl] = useState(null);
  const base_url = import.meta.env.VITE_API_URL;

  const qualities = [
    { id: 0, label: 'Poor Quality' },
    { id: 1, label: 'Low Quality' },
    { id: 2, label: 'Medium Quality' },
    { id: 3, label: 'High Quality' },
  ];

  const handleQualityChange = (id) => {
    setAudioQuality(id);
    localStorage.setItem('quality', id);
  };

  const isChecked = (id) => audioQuality === id;


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

 











  useEffect(()=> {
    if (myFavorites.length == 0) {
      const fetchDataFromLocalStorage = localStorage.getItem('last_played');
      if (fetchDataFromLocalStorage) {
        const fetchedSongs = JSON.parse(fetchDataFromLocalStorage);
        myFavorites = fetchedSongs;
        
      }
    }
  }, []);
  
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

    

  const handleMuteToggle = () => {
    setIsMuted(prev => {
        audioRef.current.muted = !prev; // Set the muted value based on the updated state
        return !prev;
    });
}

useEffect(() => {
   
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

  
 

    // Function to play offline songs


// useEffect to handle playback logic
useEffect(() => {
  let blobUrl;

  if (isPlaying && currentSong) {
    try {
      let sourceUrl;
      

     // console.log('currentSong:', currentSong); // Check the structure of currentSong
     // console.log('downloadUrl:', currentSong.downloadUrl); // Check if downloadUrl is present
      //console.log('audioBlob:', currentSong.audioBlob); // Check if audioBlob is present

      // Check if the song has a downloadUrl (URL-based source)
      if (currentSong.downloadUrl && typeof currentSong.downloadUrl === 'string') {
        if (currentSong.downloadUrl.startsWith('blob:')) {
          // If it's a Blob URL, use it directly
          sourceUrl = currentSong.downloadUrl;
        } else {
          // For normal URLs, use the downloadUrl
          sourceUrl = currentSong.downloadUrl;
        }
      } else if (currentSong.audioBlob) {
        // For offline songs with audioBlob, create a URL from the Blob
        blobUrl = URL.createObjectURL(currentSong.audioBlob);
        sourceUrl = blobUrl;
        console.log(currentSong)
      } else {
        throw new Error('Invalid audio source.');
      }

      // Set the audio source and play
      audioRef.current.src = sourceUrl;
      audioRef.current
        .play()
        .then(() => console.log('Playing audio'))
        .catch((error) => console.error('Error playing audio:', error));
    } catch (error) {
      console.error('Error setting audio source:', error);
    }
  } else {
    // Pause the audio if not playing
    audioRef.current.pause();
  }

  // Cleanup Blob URL on unmount or song change
  return () => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      blobUrl = null;
    }
    // Ensure audio is reset
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  };
}, [isPlaying, currentSong]);




     
   
  
    const handleSongClick = (song) => {
      
      const formattedSong = {
        title: song.name,
        name: song.primaryArtists,
        albumArt: song.image[2].link,
        downloadUrl: song.downloadUrl[audioQuality].link,  // Ensure this link exists
      };
      if (song) {
        if (myFavorites.length >= 5) {
          
          myFavorites.shift()
        }
        myFavorites.push(song)
        localStorage.setItem('last_played', JSON.stringify(myFavorites));
        
      //  handleSaveOffline(song)

      }
    
      setCurrentSong(formattedSong);  // Set the new song
      playSong(formattedSong);  // Start playing the song
      setIsPlayerVisible(true);  // Show the player UI
      setSongUrl(formattedSong.downloadUrl);
    };
    
    


    const togglePlayPause = (song) => {
      let sourceUrl;
    
      // For online songs, use the download URL
      if (song.downloadUrl && typeof song.downloadUrl === 'string') {
        sourceUrl = song.downloadUrl;
      } else if (song.audioBlob && song.audioBlob instanceof Blob) {
        // For offline songs, create a URL from the audioBlob
        sourceUrl = URL.createObjectURL(song.audioBlob);
      } else {
        console.error('Invalid audio source.');
        return;
      }
    
      // Set the player visibility when a song starts
      setIsPlayerVisible(true);
      setCurrentSong(song); // Update the currentSong state
    
      const isSameSong = audioRef.current.src === sourceUrl;
    
      if (isPlaying && isSameSong) {
        // If the song is playing, pause it and save the current time
        setPausedTime(audioRef.current.currentTime);
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // If it's a new song or we are resuming, handle accordingly
        if (!isSameSong) {
          setPausedTime(0); // Reset the paused time if it's a new song
    
          // Set the audio source and play the audio
          audioRef.current.src = sourceUrl;
          audioRef.current.play()
            .then(() => {
              console.log('Playing audio');
            })
            .catch((error) => {
              console.error('Error playing audio:', error);
            });
    
          setIsPlaying(true);
        } else {
          // If it's the same song, resume from the paused time
          audioRef.current.currentTime = pausedTime;
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
    };
    
    
    
    
    
  
    const handleProgressChange = (e) => {
      const newTime = (e.target.value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(e.target.value);
    };
    
    const fetchData = useCallback(async function getData() {
      try {
        const search = searchQuery || 'mitraz' 
        const response  = await axios.get(`${base_url}/search/songs?query=${search}&limit=20&page=1`);
        const data =  response.data;
        const formattedSongs = data.data.results.map((song) => ({
          ...song,
          formattedDuration: formatDuration(song.duration),
        }));
        setSongs(formattedSongs);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    }, [searchQuery])
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(searchQuery);  // Update debounced query after delay
  }, 500);  // 500ms debounce time

  // Cleanup function to clear timeout if searchQuery changes before delay
  return () => clearTimeout(timer);
}, [searchQuery]);

// Triggering fetchData after debouncedQuery change
useEffect(() => {
  if (debouncedQuery) {
    fetchData();
  }
}, [debouncedQuery]);

   
// first rendering
useEffect(() => {
  fetchData()
  handleCategories('hindi');
}, [])


const inputRef = useRef(null)
  


  const handleSearch = () => {
    setSearchQuery('')
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} min`;
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
    const response = await axios.get(`${base_url}/search/songs?query=${search}&limit=20&page=1`);
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
    const res = await axios.get(`${base_url}/modules?language=${category}`)
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
    const res = await axios.get(`${base_url}/playlists?id=${id}`)
    const data = await res.data;
    setCategorySongs(data.data.songs)
    setIsLoading(false);
  }
  catch (error) {
    console.error('Error fetching category songs:', error);
  }
}

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

const swipeHandlers = useSwipeable({
  onSwipedDown: () => setIsPlayerVisible(false),  // Hide player on swipe down
  onSwipedUp: () => setIsPlayerVisible(true),    // Show player on swipe up
});
 
const [isDrawerOpen, setIsDrawerOpen] = useState(isOpen);

  // Swipe handlers for the drawer
  const swipeFavorites = useSwipeable({
    onSwipedDown: () => {
      setIsDrawerOpen(false); // Close the drawer on swipe down
    },
    onSwipedUp: () => {
      setIsDrawerOpen(true); // Open the drawer on swipe up
    },
  });
 


  return (
    <div className="flex flex-col items-center justify-between min-h-screen px-4 py-2 bg-gray-50 dark:text-slate-400 dark:bg-zinc-900">
    
    
      <div className="w-full max-w-md">
        <div className='w-full overflow-x-auto sticky top-0 bg-gray-50  dark:text-slate-400 dark:bg-zinc-900' >

       
          <div className="one">
      <div className="two">
      <div className="flex items-center justify-between w-full">
  {/* Left side: Logo and Animation */}
  <div className="flex items-center space-x-4">
    <a
      onClick={() => window.location.reload()}
      className="logo cursor-pointer text-indigo-600 text-xl font-bold"
    >
      Syncy
    </a>
    {/* Animation container */}
    <div className="relative h-[2rem] overflow-hidden ">
      <Animation />
    </div>
  </div>

  {/* Right side: Dark Mode Button */}
  
  <button
  onClick={() => setIsPlayerVisible(false)}
  type="button" data-drawer-target="drawer-right-example" data-drawer-show="drawer-right-example" data-drawer-placement="right" aria-controls="drawer-right-example"
  
  className="rounded-full z-50 border-0 px-3 py-2 text-sm font-medium text-slate-700 bg-gray-300 dark:bg-slate-800 dark:text-yellow-400 transition-all duration-700"
>

  <i className="fa-solid fa-ellipsis-vertical"></i>
</button>

</div>



    { currentSong && <div style={{position: 'fixed', right: '-10px', borderRadius: '18px 0 0 18px', top: '60%' }} onClick={()=> setIsPlayerVisible(!isPlayerVisible)} className='z-50 cursor-pointer border-0 player-btn px-4 py-2 text-sm font-medium text-white bg-indigo-600'><i  className="fa-solid fa-headphones cursor-pointer"></i>
    </div>}
  </div>
          </div>

          <div className="flex items-center mt-4 mb-8 bg-gray-100 rounded-full dark:text-slate-400 dark:bg-zinc-900">
          <FaTimes onClick={handleSearch} className="w-5 h-5 ml-3 text-gray-500 cursor-pointer" />
          <input ref={inputRef}
            type="text"
            value={searchQuery}
		  onFocus={() => setIsPlayerVisible(false)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mitraz"
            className="w-full py-2 pl-4 pr-4 text-sm bg-gray-100 rounded-full focus:outline-none placeholder:italic placeholder:text-slate-500"
          />
          <FaHeadphones onClick={()=> setIsPlayerVisible(!isPlayerVisible)} className='cursor-pointer' />
          </div>
          </div>
        <div className="flex items-center justify-between w-full pb-2 mb-4 text-sm font-semibold border-b overflow-x-auto dark:text-slate-400 dark:bg-zinc-900">
          <span
            onClick={() =>{ setActiveTab('Songs'); setIsPlayerVisible(false)} }
            className={`cursor-pointer ${activeTab === 'Songs' ? 'border-b-2 border-yellow-400' : 'text-gray-400 hover:text-gray-800'}`}
          >
            Songs
          </span>
          
          <span
            onClick={() => {setActiveTab('Favorite'); setIsPlayerVisible(false); setTimeout(() => {toggleDrawer(); setIsDrawerOpen(true);}, 200); }}
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

           <span
            onClick={() => {setActiveTab('Offline'),  setIsPlayerVisible(false)} }
            className={`hidden cursor-pointer ${activeTab === 'Offline' ? 'border-b-2 border-yellow-400' : 'text-gray-400 hover:text-gray-800'}`}
          >
            Offline
          </span>

        
          
        </div>
        {activeTab === 'Songs' && (
          <div className="mb-12 ">
          <div className='w-full sticky top-0 bg-gray-50  dark:text-slate-400 dark:bg-zinc-900 z-40'>
            <h3 className="mb-4 text-lg font-semibold">Latest Songs</h3>
            <div className="overflow-x-auto">
  <div className="flex gap-4 mb-10" >
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
              onClick={() => togglePlayPause(song.downloadUrl[audioQuality].link)}
              className="text-gray-400 cursor-pointer"
            >
              {isPlaying && audioRef.current.src === song.downloadUrl[audioQuality].link ? <FaPause /> : <FaPlay />}
            </button>
          </div>
        </div>
      </div>
    )) : <Loader />}
  </div>
            </div>
            </div>
            
            <div className='overflow-y-auto '>
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
                    onClick={() => {togglePlayPause(song.downloadUrl[audioQuality].link), handleSongClick(song)}}
                    className="text-gray-400 cursor-pointer"
                  >
                    {isPlaying && audioRef.current.src === song.downloadUrl[audioQuality].link ? <FaPause /> : <FaPlay />}
                  </button>
                </li>
              )) : <Loader />}
            </ul>
            </div>


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
              onClick={() => togglePlayPause(song.downloadUrl[audioQuality].link)}
              className="text-gray-400 cursor-pointer"
            >
              {isPlaying && audioRef.current.src === song.downloadUrl[audioQuality].link ? <FaPause /> : <FaPlay />}
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
        <div {...swipeFavorites} onClick={() => {
          toggleDrawer();
          setIsDrawerOpen(true);
        }}> {/* Apply swipeable handlers */}
          <h3 className="mb-4 text-lg font-semibold cursor-pointer" onClick={toggleDrawer}>
            Favorites <i className="fa-solid fa-star" style={{ color: '#fcd34d' }}></i>
          </h3>
          
          <svg className="animate-bounce w-6 h-6 ..." />
  
          <div className={`app-drawer dark:text-slate-400 dark:bg-zinc-900 ${isDrawerOpen ? 'open' : ''}`}>
            <span className='backButton' onClick={() => setIsDrawerOpen(false)}><i className="fa-solid fa-chevron-down"></i></span>

           
  
            <div className="drawer-handle" onClick={toggleDrawer}>
              <span className="handle-bar"></span>
            </div>
            <div className="app-list">
              <h2 className="heart-beat dark:text-slate-400 dark:bg-zinc-900">Heart Beats</h2>
              <ul className="song-list">
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
                        <h4 className="text-base font-semibold">{song.name}</h4>
                        <p className="text-sm text-gray-500">
                          {song.primaryArtists} &nbsp; &nbsp;
                          <span className="text-sm text-gray-400">
                            {song.formattedDuration}
                          </span> &nbsp; &nbsp; &nbsp; &nbsp;
                          <i className="fa-heart fa-solid" style={{ cursor: 'pointer', color: '#dc2626' }}></i>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => togglePlayPause(song.downloadUrl[audioQuality].link)}
                      className="text-gray-400 cursor-pointer"
                    >
                      {isPlaying && audioRef.current.src === song.downloadUrl[audioQuality].link ? <FaPause /> : <FaPlay />}
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
            <div className='overflow-y-auto h-96'>

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
                    onClick={() => togglePlayPause(song.downloadUrl[audioQuality].link)}
                    className="text-gray-400 cursor-pointer"
                  >
                    {isPlaying && audioRef.current.src === song.downloadUrl[audioQuality].link ? <FaPause /> : <FaPlay />}
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

             <div className='overflow-y-auto h-96'>
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
              onClick={() => togglePlayPause(song.downloadUrl[audioQuality].link)}
              className="text-gray-400 cursor-pointer"
            >
              {isPlaying && audioRef.current.src === song.downloadUrl[audioQuality].link ? (
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

            </div>
        )}

      {/*
        {activeTab === 'Offline' && (
       <li>
           <button
             type="button"
             className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
           >
             <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
               Last Played
             </span>
             <span className="inline-flex me-2 items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
               {offlineSongs.length}
             </span>
             <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
               <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
             </svg>
           </button>
           <ul id="dropdown-example" className={`${isDropdownOpen ? '' : 'hidden'} py-2 space-y-2`}>
             {offlineSongs.length > 0 &&
               offlineSongs.map((song, index) => (
                 <li
                   key={index}
                   className="flex items-center justify-start ps-4 cursor-pointer"
                   onClick={() => togglePlayPause(song)}
                 >
                   <img src={song.image || song.albumArt} alt="" className="w-11 rounded-sm" />
                   <a
                     className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                   >
                     {song.name}
                   </a>
                 </li>
               ))}
           </ul>
       </li>
       )}*/}
      </div>

      {/* Player Container */}
      





<div id="drawer-right-example" className="fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-white w-80 dark:bg-gray-800" tabIndex="-1" aria-labelledby="drawer-right-label">
    <h5 id="drawer-right-label" className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"><svg className="w-4 h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>Manage </h5>
   <button type="button" data-drawer-hide="drawer-right-example" aria-controls="drawer-right-example" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white" >
      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
         <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
      <span className="sr-only">Close menu</span>
   </button>
  


   <div className="py-4 overflow-y-auto">
      <ul className="space-y-2 font-medium">
         <li >
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
               </svg>
               <span className="ms-3">Dashboard</span>
            </a>
         </li>
         <li>
          
         <button type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                  <span className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                    <i className="fa-solid fa-music"></i>
                  </span>
                  
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Audio Quality</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </button>
            <ul id="dropdown-example" className="hidden py-2 space-y-2">
            {qualities.map((quality) => (
        <li key={quality.id}>
          <a
            href="#"
            onClick={() => handleQualityChange(quality.id)}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center h-5">
                <input
                  id={`helper-radio-${quality.id}`}
                  name="helper-radio"
                  type="radio"
                  value={quality.id}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  checked={isChecked(quality.id)}
                  readOnly
                />
              </div>
              <div className="ms-2 text-sm">
                <label
                  htmlFor={`helper-radio-${quality.id}`}
                  className="text-gray-900 dark:text-gray-300"
                >
                  <div className="font-semibold text-md">{quality.label}</div>
                </label>
              </div>
            </div>
          </a>
        </li>
      ))}
                 
                
            </ul>
 
            
         </li>
        
         <li className='hidden'>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
               <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
            </a>
         </li>
         
         <li>
            <a href="#" className="flex items-center p-2 gap-3 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z"/>
                  <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z"/>
                  <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z"/>
               </svg>
               <button
  
                onClick={() =>  setDarkMode(!darkMode)}
                className="rounded-full z-50 border-0 px-3 py-2 text-sm font-medium text-slate-700 bg-gray-300 dark:bg-slate-800 dark:text-yellow-400 transition-all duration-700">
                  <i
                   className={`${
                   darkMode ? "fa-regular fa-sun" : "fa-solid fa-moon"
                   } transform transition-transform duration-700 ease-in-out ${
                   darkMode ? "rotate-180 scale-110" : "rotate-0 scale-100"
                   }`}
                  ></i>
  
              </button>
            </a>
         </li>
      </ul>
   </div>


</div>

     

      <div  {...swipeHandlers}
  style={{
    zIndex: '1002',
    transform: isPlayerVisible ? 'translateY(0)' : 'translateY(100%)',
    opacity: isPlayerVisible ? 1 : 0, // Smooth fade in/out
    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out', // Smooth transitions
  }}
  className="fixed bottom-0 w-full max-w-md px-4 bg-white rounded-t-xl shadow-md dark:text-slate-400 dark:bg-zinc-900"
>
{currentSong && (
  <>
    <div className="flex items-center justify-start mt-2">
      <button
        onClick={() => setIsPlayerVisible(false)}
        className="w-10 h-10 rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700 ml-2"
      >
        <i className="fa-solid fa-chevron-down"></i>
      </button>
    </div>
    <div className="flex flex-col items-center py-4">
      <div className="flip-card w-72 h-72 rounded-lg shadow-lg">
        <div
          className={`flip-card-inner w-72 h-72 rounded-lg shadow-lg ${isFlipped ? 'rotate' : 'rotate-back'}`}
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
          <div className="flip-card-back w-72 h-72 rounded-lg shadow-lg" onClick={() => setIsFlipped(false)} />
        </div>
      </div>

      <h3 className="text-2xl font-bold">{currentSong.title}</h3>
      <p className="text-gray-500" onClick={() => { setSearchQuery(currentSong.name); setIsPlayerVisible(false); }}>
        {currentSong.name}
      </p>

      <div className="flex justify-between w-full mt-4">
        <button
          style={{ paddingLeft: '12px', display: 'flex', alignItems: 'center' }}
          onClick={() => handleDownload(currentSong)}
          className="w-10 h-10 rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700"
        >
          <i className="fa-solid fa-download"></i>
        </button>

        <button
          style={{ paddingLeft: '12px' }}
          onClick={() => togglePlayPause(currentSong)}
          className="w-10 h-10 rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <button
          style={{ paddingLeft: '12px' }}
          onClick={handleMuteToggle}
          className="w-10 h-10 rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700"
        >
          {isMuted ? <MdOutlineVolumeOff /> : <MdOutlineVolumeUp />}
        </button>
      </div>

      <label className="w-full flex mt-2 items-center justify-center gap-1 px-1">
        <span className="currentTime">{formatTime(currentTime)}</span>
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
        <span className="musicDuration">{formatTime(musicDuration)}</span>
      </label>
    </div>
  </>
)}

      </div>
      


    </div>
  );
};

export default MusicDiscover;
