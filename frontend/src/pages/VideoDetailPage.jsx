// frontend/src/pages/VideoDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams and Link
import { sampleVideos } from '../data/mockVideos'; // Import our mock data
import './VideoDetailPage.css'; // We'll create this CSS file

function VideoDetailPage() {
  const { videoId } = useParams(); // Get videoId from URL parameters
  const video = sampleVideos.find(v => v.id.toString() === videoId); // Find the video by ID

  if (!video) {
    return (
      <div className="video-detail-page page-content">
        <h2>Video Not Found</h2>
        <p>Sorry, we couldn't find the video you're looking for.</p>
        <Link to="/">Go back to Home</Link>
      </div>
    );
  }

  // Placeholder for video player - you'd integrate a real player here
  const VideoPlayerPlaceholder = () => (
    <div className="video-player-placeholder">
      <img src={video.thumbnailUrl || 'https://via.placeholder.com/640x360.png?text=Video+Player+Area'} alt={`Video player for ${video.title}`} />
      <span>▶️ Video Player Area (Using Thumbnail as Placeholder)</span>
    </div>
  );

  return (
    <div className="video-detail-page">
      <div className="video-player-section">
        <VideoPlayerPlaceholder />
      </div>
      <div className="video-content-section">
        <h1>{video.title}</h1>
        <p className="creator-info">By: <span className="creator-name-detail">{video.creatorName}</span></p>
        <p className="video-description">{video.description}</p>
        <div className="purchase-section">
          <p className="video-price-detail">
            Price: {video.price === 0 ? 'Free' : `₹${video.price}`}
          </p>
          <button className="buy-now-button-detail">
            {video.price === 0 ? 'Watch Video' : 'Buy Now'}
          </button>
        </div>
        {/* More sections like comments, related videos can go here */}
      </div>
    </div>
  );
}

export default VideoDetailPage;