// frontend/src/pages/UploadPage.jsx
import React from 'react';
import UploadVideo from '../components/Creator/UploadVideo'; // Check path
import { useAuth } from '../context/AuthContext'; // Assuming you use AuthContext

const UploadPage = () => {
  const { currentUser } = useAuth(); // Or however you get the logged-in user

  // Optional: Add a check here if needed, though ProtectedRoute should handle it
  if (!currentUser) {
    // This case should ideally be handled by ProtectedRoute redirecting to login
    return <p className="text-center mt-10">Please log in to upload videos.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* You can add a page title or other layout elements here */}
      {/* <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Upload Your Video</h1> */}
      <UploadVideo />
    </div>
  );
};

export default UploadPage;