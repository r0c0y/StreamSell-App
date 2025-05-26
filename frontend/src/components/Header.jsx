// frontend/src/components/Header.jsx
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
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
          <NavLink to="/upload">Upload</NavLink>

          {currentUser ? (
            <>
              {/* Display displayName if available, otherwise fallback to email */}
              <span className="user-greeting">
                Hi, {currentUser.displayName || currentUser.email}
              </span>
              {/* Example: Log role if needed for debugging
              {currentUser.role && <span style={{color: 'yellow', marginLeft: '5px'}}>({currentUser.role})</span>}
              */}
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