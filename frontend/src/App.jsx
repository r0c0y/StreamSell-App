// frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'; // Ensure you have the .page-content styles here or in index.css
import Header from './components/Header';
import Footer from './components/Footer';

// Import Page Components
import HomePage from './pages/HomePage';
import BrowseVideosPage from './pages/BrowseVideosPage';
import UploadPage from './pages/UploadPage';
import LoginPage from './pages/LoginPage';
import VideoDetailPage from './pages/VideoDetailPage'; // <-- IMPORT
import NotFoundPage from './pages/NotFoundPage'; // <-- IMPORT
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  return (
    <>
      <Header />
      <main style={{
          paddingTop: '80px',
          paddingBottom: '130px',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          paddingLeft: '20px',
        paddingRight: '20px',
        flexGrow: 1 
        }}
      >
        {/* REMOVE H1, P, and VideoList from here if they were here */}
        {/* <h1>Welcome to StreamSell!</h1> */}
        {/* <p>The best place to sell and watch exclusive video content.</p> */}
        {/* <VideoList /> */}

        <Routes> {/* Routes should be the direct child here for page content */}
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowseVideosPage />} />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/video/:videoId" element={<VideoDetailPage />} /> {/* <-- ADD THIS ROUTE */}
          <Route path="*" element={<NotFoundPage />} /> {/* <-- ADD CATCH-ALL ROUTE (MUST BE LAST) */}
        </Routes>
      </main>
      <Footer />
    </>
  );
}
export default App;