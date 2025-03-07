import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChartLine, FaUserClock, FaCog, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { BsFileText } from 'react-icons/bs';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return children;
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="brand">
          <h2>FreelanceFlow</h2>
        </div>
        
        <nav className="nav-menu">
          <Link 
            to="/dashboard" 
            className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            <FaChartLine /> Dashboard
          </Link>
          <Link 
            to="/templates" 
            className={`nav-item ${location.pathname === '/templates' ? 'active' : ''}`}
          >
            <BsFileText /> Email Templates
          </Link>
          <Link 
            to="/clients" 
            className={`nav-item ${location.pathname === '/clients' ? 'active' : ''}`}
          >
            <FaUserClock /> Client Tracking
          </Link>
          <Link 
            to="/settings" 
            className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
          >
            <FaCog /> Settings
          </Link>
        </nav>

        <div className="user-section">
          <button 
            className="user-menu-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <FaUser className="user-icon" />
            <span>{user.email}</span>
          </button>

          {showUserMenu && (
            <div className="user-menu">
              <Link to="/settings" className="user-menu-item">
                <FaCog /> Profile Settings
              </Link>
              <button onClick={handleLogout} className="user-menu-item logout">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 