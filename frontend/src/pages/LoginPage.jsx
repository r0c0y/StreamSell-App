// frontend/src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(''); // <<--- 1. ADD THIS STATE
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const { signup, login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true }); // Redirect to 'from' or homepage
    }
  }, [currentUser, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation for displayName if signing up
    if (!isLogin && displayName.trim() === '') {
      setError('Display Name is required for sign up.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, displayName); // <<--- 3. PASS DISPLAYNAME HERE
      }
      // Redirect is handled by useEffect
    } catch (err) {
      // Improved error handling based on common Firebase codes
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use. Please try logging in or use a different email.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || (isLogin ? 'Failed to log in' : 'Failed to create an account'));
      }
      console.error("Auth Error in LoginPage:", err); // Log the full error for debugging
    }
    setLoading(false);
  };

  const toggleFormMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setDisplayName(''); // <<--- 4. CLEAR DISPLAYNAME WHEN TOGGLING
  };

  if (currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="login-page-container page-content">
      <div className="login-form-wrapper">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && ( // <<--- 2. ADD THIS ENTIRE BLOCK FOR DISPLAY NAME INPUT
            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isLogin ? undefined : 6}
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        <p className="toggle-form-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={toggleFormMode} className="toggle-form-button">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;