// frontend/src/components/VideoList.jsx
import React from 'react';
import VideoCard from './VideoCard';
import './VideoList.css';
import { sampleVideos } from '../data/mockVideos'; // <-- IMPORT FROM NEW LOCATION

function VideoList() {
  // The sampleVideos array is now imported
  return (
    <div className="video-list-container">
      <h2>Featured Videos</h2>
      <div className="video-grid">
        {sampleVideos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default VideoList;