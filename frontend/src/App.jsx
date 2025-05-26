// frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; // Ensure this import is correct

// Import Page Components
import HomePage from './pages/HomePage';
import BrowseVideosPage from './pages/BrowseVideosPage';
import UploadPage from './pages/UploadPage';
import LoginPage from './pages/LoginPage';
import VideoDetailPage from './pages/VideoDetailPage';
import NotFoundPage from './pages/NotFoundPage';
// You might want an UnauthorizedPage later
// import UnauthorizedPage from './pages/UnauthorizedPage';

function App() {
  return (
    <>
      <Header />
      <main style={{ /* ... your existing main styles ... */ }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowseVideosPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/video/:videoId" element={<VideoDetailPage />} />
          {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}


          {/* Protected Routes for Creators */}
          {/* All routes nested under this element will use ProtectedRoute logic */}
          <Route element={<ProtectedRoute allowedRoles={['creator']} />}> {/* Pass allowed roles */}
            <Route path="/upload" element={<UploadPage />} />
            {/* Example: Another creator-only route */}
            {/* <Route path="/dashboard" element={<CreatorDashboardPage />} /> */}
          </Route>

          {/* You could have other ProtectedRoute groups for other roles, e.g., admins */}
          {/* <Route element={<ProtectedRoute allowedRoles={['admin']} />}> */}
          {/*   <Route path="/admin/users" element={<AdminUsersPage />} /> */}
          {/* </Route> */}

          {/* Not Found Route (must be last) */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;