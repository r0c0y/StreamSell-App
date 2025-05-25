// frontend/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'; // <-- IMPORT BrowserRouter
import { AuthProvider } from './context/AuthContext'; // <-- IMPORT AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- WRAP App with BrowserRouter */}
      <AuthProvider> {/* <-- WRAP App with AuthProvider */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

