// frontend/src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Import useLocation
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const { signup, login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get location object
  const from = location.state?.from?.pathname || "/"; // Get 'from' path or default to homepage

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

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      // No need to navigate here, useEffect will handle it when currentUser updates
      // navigate(from, { replace: true }); // Redirect to the page they came from, or homepage
    } catch (err) {
      setError(err.message || (isLogin ? 'Failed to log in' : 'Failed to create an account'));
    }
    setLoading(false);
  };

  const toggleFormMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
  };

  // If currentUser becomes available while on this page (e.g. due to fast auth check)
  // the useEffect above will handle the redirect. So, we might not even see this render much.
  if (currentUser) {
    return <div>Loading...</div>; // Or redirect immediately, but useEffect is cleaner
  }

  return (
    <div className="login-page-container page-content">
      <div className="login-form-wrapper">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* ... rest of your form ... */}
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