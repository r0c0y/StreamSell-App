// frontend/src/components/VideoCard.jsx
import React, { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom';
import './VideoCard.css';

// You can define a default placeholder image or a broken image icon URL
const DEFAULT_PLACEHOLDER_IMAGE = 'https://via.placeholder.com/320x180.png?text=No+Image';
const BROKEN_IMAGE_ICON_URL = 'https://cdn-icons-png.flaticon.com/512/128/128282.png'; // Example broken image icon (find a better one or host your own)

function VideoCard({ video }) {
  const id = video?.id || 'unknown-id';
  const title = video?.title || 'Video Title Placeholder';

  // Determine initial image source
  const initialImageSrc =
    video?.thumbnailUrl && video.thumbnailUrl.trim() !== ''
      ? video.thumbnailUrl
      : DEFAULT_PLACEHOLDER_IMAGE;

  // State to manage current image source, defaults to initial or placeholder
  const [imageSrc, setImageSrc] = useState(initialImageSrc);
  // State to track if a custom error image is being shown
  const [isErrorImage, setIsErrorImage] = useState(initialImageSrc === DEFAULT_PLACEHOLDER_IMAGE && !(video?.thumbnailUrl && video.thumbnailUrl.trim() !== ''));


  const creatorName =
    video?.creatorDisplayName || video?.creatorName || 'Creator Name';

  let priceDisplay;
  if (video?.price === undefined) {
    priceDisplay = 'Price TBD';
  } else if (video.price === 0) {
    priceDisplay = 'Free';
  } else {
    priceDisplay = `₹${video.price}`;
  }
  const buttonText = video?.price === 0 ? 'Watch Now' : 'View Details';

  // Function to handle image loading errors
  const handleImageError = () => {
    // If the current imageSrc is already the placeholder, don't do anything (to avoid loops if placeholder itself fails)
    // Or if it's already our custom broken image icon.
    if (imageSrc !== DEFAULT_PLACEHOLDER_IMAGE && imageSrc !== BROKEN_IMAGE_ICON_URL) {
      // console.warn(`Failed to load thumbnail: ${initialImageSrc}. Using fallback.`);
      setImageSrc(BROKEN_IMAGE_ICON_URL); // <<-- Set to your preferred broken image icon URL
      setIsErrorImage(true);
    } else if (imageSrc === DEFAULT_PLACEHOLDER_IMAGE && !isErrorImage) {
      // If the via.placeholder.com failed, use the broken image icon
       setImageSrc(BROKEN_IMAGE_ICON_URL);
       setIsErrorImage(true);
    }
  };

  return (
    <div className="video-card">
      <Link to={`/video/${id}`} className="video-card-link" aria-label={`View details for ${title}`}>
        <div className={`video-thumbnail-wrapper ${isErrorImage ? 'error-state' : ''}`}>
          <img
            src={imageSrc}
            alt={title}
            className="video-thumbnail"
            onError={handleImageError} // Add onError handler
          />
          {isErrorImage && <span className="broken-image-indicator">⚠️</span>} {/* Or an <img> tag for an icon */}
        </div>
        <div className="video-info">
          <h3 className="video-title">{title}</h3>
          <p className="creator-name">{creatorName}</p>
        </div>
      </Link>

      <div className="video-card-footer">
        <p className="video-price">{priceDisplay}</p>
        <Link to={`/video/${id}`} className="buy-button">
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

export default VideoCard;