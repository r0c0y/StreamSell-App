// frontend/src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// You can create a NotFoundPage.css if you want specific styles
// import './NotFoundPage.css';

function NotFoundPage() {
  return (
    <div className="page-content" style={{ textAlign: 'center', paddingTop: '50px' }}> {/* Using existing .page-content and adding some style */}
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist or has been moved.</p>
      <img
        src="https://i.imgur.com/qIufhof.png" // A generic 404 image, or find your own
        alt="Page Not Found"
        style={{ maxWidth: '300px', margin: '20px auto', display: 'block' }}
      />
      <Link
        to="/"
        style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#3498db',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}
      >
        Go Back to Homepage
      </Link>
    </div>
  );
}

export default NotFoundPage;