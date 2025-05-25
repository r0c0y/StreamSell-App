// frontend/src/components/Header.jsx
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/AuthContext'; // Import useAuth
import './Header.css';

function Header() {
  const { currentUser, logout } = useAuth(); // Get currentUser and logout function
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Failed to log out", error);
      // Handle logout error (e.g., show a message)
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <Link to="/">StreamSell</Link>
        </div>
        <nav className="navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/browse">Browse Videos</NavLink>
          <NavLink to="/upload">Upload</NavLink> {/* We'll protect this route later */}

          {currentUser ? (
            <>
              {/* You can add a link to a user profile page here later */}
              {/* <NavLink to="/profile">Profile</NavLink> */}
              <span className="user-email">{currentUser.email}</span> {/* Display user's email */}
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;