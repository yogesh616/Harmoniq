import { useParams } from 'react-router-dom';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
function Playlist() {
  const { id } = useParams(); // Extracts the id from the URL
  console.log(id); // Logs the playlist ID
const [user, setUser] = useState(null)

   useEffect(() => {
    
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
         setUser(currentUser)
         getPlaylistSongs(id, currentUser?.uid);
          
        } else {
         setUser(null)
        }
      });
  
      
      return () => unsubscribe();
   }, [])
  

  const getPlaylistSongs = async (playlistId, userId) => {
    try {
      // Query playlists by both userId and document ID
      const q = query(
        collection(db, "playlists"),
        where("userId", "==", userId), // Filter by userId
        where("__name__", "==", playlistId) // Filter by document ID
      );
  
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const playlist = querySnapshot.docs[0].data();
        
        console.log("Playlist songs:", playlist.songs);
      } else {
        console.error("No playlist found for the given user and playlist ID.");
        
      }
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
    }
  };
  
  useEffect(() => {
    getPlaylistSongs(id, user?.uid);
  }, [user])
  

  return (
    <div>
      <h1>Playlist ID: {id}</h1>
      {/* Other components or logic related to the playlist */}
    </div>
  );
}

export default Playlist;
