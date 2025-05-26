// frontend/src/pages/VideoDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase'; // Import Firestore instance
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import './VideoDetailPage.css'; // Your existing CSS for this page

function VideoDetailPage() {
  const { videoId } = useParams(); // Get videoId from URL parameters
  const [video, setVideo] = useState(null); // To store the fetched video object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      setError(null);
      if (!videoId) {
        setError("Video ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const videoDocRef = doc(db, "videos", videoId); // Create a reference to the specific video document
        const docSnap = await getDoc(videoDocRef);    // Fetch the document

        if (docSnap.exists()) {
          setVideo({ id: docSnap.id, ...docSnap.data() }); // Set video state with ID and data
        } else {
          setError("Video not found.");
          console.warn(`No video document found for ID: ${videoId}`);
        }
      } catch (err) {
        console.error("Error fetching video details:", err);
        setError("Failed to load video details. Please try again.");
      }
      setLoading(false);
    };

    fetchVideo();
  }, [videoId]); // Re-run effect if videoId changes

  if (loading) {
    return (
      <div className="video-detail-page page-content"> {/* Use page-content for consistent centering */}
        <h2>Loading Video Details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-detail-page page-content">
        <h2 style={{ color: 'red' }}>Error</h2>
        <p>{error}</p>
        <Link to="/">Go back to Home</Link>
      </div>
    );
  }

  if (!video) {
    // This case should ideally be caught by the error state if video not found
    // but as a fallback:
    return (
      <div className="video-detail-page page-content">
        <h2>Video Not Found</h2>
        <p>Sorry, we couldn't find the video you're looking for.</p>
        <Link to="/">Go back to Home</Link>
      </div>
    );
  }

  // Video data is available, render the details
  // Use the correct field names from your Firestore document (e.g., creatorDisplayName)
  const creator = video.creatorDisplayName || video.creatorName || "Unknown Creator";
  const priceDisplay = video.price === 0 ? 'Free' : (video.price ? `₹${video.price}` : 'Price Not Set');
  const purchaseButtonText = video.price === 0 ? 'Watch Video' : 'Buy Now';


  // Placeholder for actual video player
  const VideoPlayerPlaceholder = () => (
    <div className="video-player-placeholder">
      {video.thumbnailUrl ? (
        <img src={video.thumbnailUrl} alt={`Thumbnail for ${video.title}`} style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain' }} />
      ) : (
        <span>▶️ Video Player Area</span>
      )}
    </div>
  );

  return (
    <div className="video-detail-page"> {/* Keep your existing main class */}
      <div className="video-player-section">
        <VideoPlayerPlaceholder />
      </div>
      <div className="video-content-section">
        <h1>{video.title}</h1>
        <p className="creator-info">By: <span className="creator-name-detail">{creator}</span></p>
        {/* Ensure your CSS for video-description handles line breaks (e.g., white-space: pre-wrap;) */}
        <p className="video-description">{video.description || "No description available."}</p>
        
        <div className="purchase-section">
          <p className="video-price-detail">{priceDisplay}</p>
          {/* This button's action will be implemented later with payment integration */}
          <button className="buy-now-button-detail">
            {purchaseButtonText}
          </button>
        </div>
        {/* You can add more sections here later, like:
            - Category / Tags
            - Upload Date
            - View Count
            - Comments Section
        */}
      </div>
    </div>
  );
}

export default VideoDetailPage;