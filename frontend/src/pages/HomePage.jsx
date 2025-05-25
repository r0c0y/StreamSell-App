// frontend/src/pages/HomePage.jsx
import React from 'react';
import VideoList from '../components/VideoList'; // Assuming VideoList is in components
// If you have specific styles for the homepage welcome, import them or use inline
// import './HomePage.css';

function HomePage() {
  return (
    // You can add a wrapper div with a class if needed for specific homepage styling
    <div>
      {/* These are the elements that were global before, now specific to HomePage */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}> {/* Simple centering for welcome */}
        <h1>Welcome to StreamSell!</h1>
        <p style={{ fontSize: '1.1em', color: '#555' }}>The best place to sell and watch exclusive video content.</p>
      </div>

      <VideoList /> {/* VideoList is now part of the HomePage content */}
    </div>
  );
}

export default HomePage;