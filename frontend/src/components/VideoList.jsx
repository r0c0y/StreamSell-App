// frontend/src/components/VideoList.jsx
import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import './VideoList.css';
import { db } from '../firebase';
// Ensure onSnapshot is imported
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

function VideoList() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true); // Set loading at the beginning of the effect
    setError(null);     // Clear previous errors

    // 1. Get a reference to the 'videos' collection in Firestore
    const videosCollectionRef = collection(db, 'videos');

    // 2. Create a query to order videos by 'createdAt' (newest first) and limit results
    //    Adjust 'limit(12)' or the orderBy field as needed for your application
    const q = query(videosCollectionRef, orderBy('createdAt', 'desc'), limit(12));

    // 3. Set up the real-time listener using onSnapshot
    //    onSnapshot returns an unsubscribe function, which we'll use for cleanup
    const unsubscribe = onSnapshot(
      q, // The query to listen to
      (querySnapshot) => {
        // This callback fires initially and whenever the query results change
        const fetchedVideos = querySnapshot.docs.map((doc) => ({
          id: doc.id,       // Get the document ID
          ...doc.data()     // Get all other data fields from the document
        }));
        setVideos(fetchedVideos); // Update the videos state
        setIsLoading(false);      // Data has been fetched (or updated), so not loading anymore
        setError(null);           // Clear any previous errors if data is successfully fetched
      },
      (err) => { // This is the error callback for the onSnapshot listener
        console.error("Error listening to videos collection:", err);
        setError("Failed to load videos in real-time. Please try refreshing or check back later.");
        setIsLoading(false); // Stop loading even if there's an error
      }
    );

    // 4. Cleanup function: This is crucial!
    //    It runs when the component unmounts, unsubscribing from the Firestore listener
    //    to prevent memory leaks and unnecessary background operations.
    return () => {
      unsubscribe();
    };

  }, []); // Empty dependency array means this effect runs once when the component mounts
          // and the cleanup function runs when it unmounts.

  // Conditional rendering based on loading, error, and videos states
  if (isLoading) {
    return (
      <div className="video-list-container page-content">
        <h2>Loading Videos...</h2>
        {/* You could replace this with a more sophisticated spinner component */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-list-container page-content">
        <h2 style={{ color: 'red' }}>Error Loading Videos</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!isLoading && videos.length === 0) {
    return (
      <div className="video-list-container page-content">
        <h2>No Videos Found</h2>
        <p>It looks like there's no content here yet. Add some videos or check back soon!</p>
      </div>
    );
  }

  // If everything is fine, render the list of videos
  return (
    <div className="video-list-container">
      <h2>Featured Videos</h2> {/* Or simply "Videos", or make this dynamic */}
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default VideoList;