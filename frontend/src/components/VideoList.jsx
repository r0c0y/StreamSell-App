// frontend/src/components/VideoList.jsx
import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard'; // Assuming VideoCard.jsx is in the same directory
import './VideoList.css';          // Assuming VideoList.css is in the same directory
import { db } from '../firebase';   // Your Firestore instance from firebase.js
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

function VideoList() {
  const [videos, setVideos] = useState([]); // To store the array of video objects
  const [isLoading, setIsLoading] = useState(true); // To show a loading state
  const [error, setError] = useState(null); // To show an error message if fetching fails

  useEffect(() => {
    // Define an async function to fetch videos from Firestore
    const fetchVideosFromFirestore = async () => {
      setIsLoading(true); // Set loading true at the start of fetching
      setError(null);     // Clear any previous errors

      try {
        // 1. Get a reference to the 'videos' collection
        const videosCollectionRef = collection(db, 'videos');

        // 2. Create a query (optional: for ordering, filtering, limiting)
        //    - Order by 'createdAt' in descending order (newest first)
        //    - Limit to 12 videos for this example
        const q = query(videosCollectionRef, orderBy('createdAt', 'desc'), limit(12));

        // 3. Execute the query to get a snapshot of the documents
        const querySnapshot = await getDocs(q); // Use getDocs(videosCollectionRef) to get all without query

        // 4. Map over the documents in the snapshot to extract data
        const fetchedVideos = querySnapshot.docs.map((doc) => {
          // For each document, return an object with its ID and data
          return {
            id: doc.id,          // The unique ID of the Firestore document
            ...doc.data()        // Spread all fields from the document (title, price, etc.)
          };
        });

        setVideos(fetchedVideos); // Update the state with the fetched videos
      } catch (err) {
        console.error("Error fetching videos from Firestore:", err);
        setError("Failed to load videos. Please check your connection or try again later.");
      } finally {
        setIsLoading(false); // Set loading to false once fetching is complete (success or fail)
      }
    };

    fetchVideosFromFirestore(); // Call the fetch function when the component mounts

  }, []); // Empty dependency array ensures this effect runs only once on component mount

  // Conditional rendering based on loading and error states
  if (isLoading) {
    return (
      <div className="video-list-container page-content">
        <h2>Loading Videos...</h2>
        {/* You could add a spinner component here */}
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

  if (videos.length === 0) {
    return (
      <div className="video-list-container page-content">
        <h2>No Videos Found</h2>
        <p>It looks like there's no content here yet. Check back soon!</p>
      </div>
    );
  }

  // If loaded, no error, and videos exist, render the list
  return (
    <div className="video-list-container">
      <h2>Featured Videos</h2> {/* Or simply "Videos" */}
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default VideoList;