// frontend/src/components/VideoCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './VideoCard.css';

function VideoCard({ video }) {
  // MORE ROBUST LOGIC FOR THUMBNAIL
  const thumbnailUrl = (video?.thumbnailUrl && video.thumbnailUrl.trim() !== '')
                         ? video.thumbnailUrl
                         : 'https://via.placeholder.com/320x180.png?text=No+Image';

  const title = video?.title || 'Video Title Placeholder';
  const creatorName = video?.creatorName || 'Creator Name';
  const price = video?.price !== undefined ? (video.price === 0 ? 'Free' : `₹${video.price}`) : 'Price TBD';

  return (
    <div className="video-card">
      <Link to={`/video/${video.id}`} className="video-card-link">
        <img src={thumbnailUrl} alt={title} className="video-thumbnail" /> {/* Use 'title' for alt for better accessibility */}
        <div className="video-info">
          <h3 className="video-title">{title}</h3>
          <p className="creator-name">{creatorName}</p>
        </div>
      </Link>
      <div className="video-card-footer">
        <p className="video-price">{price}</p>
        <Link to={`/video/${video.id}#buy`} className="buy-button">
            {video?.price === 0 ? 'Watch Now' : 'View Details'}
        </Link>
      </div>
    </div>
  );
}

export default VideoCard;