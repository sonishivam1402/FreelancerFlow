import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChartLine, FaUserClock, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { BsFileText } from 'react-icons/bs';
import '../styles/Layout.css';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [userName, setUserName] = useState('');

  // Fetch user name when component mounts
  React.useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'Login', user.userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || user.email);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    if (user) {
      fetchUserName();
    }
  }, [user]);

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
            onClick={() => setShowUserMenu(false)}
          >
            <FaChartLine /> Dashboard
          </Link>
          <Link 
            to="/templates" 
            className={`nav-item ${location.pathname === '/templates' ? 'active' : ''}`}
            onClick={() => setShowUserMenu(false)}
          >
            <BsFileText /> Email Templates
          </Link>
          <Link 
            to="/clients" 
            className={`nav-item ${location.pathname === '/clients' ? 'active' : ''}`}
            onClick={() => setShowUserMenu(false)}
          >
            <FaUserClock /> Client Tracking
          </Link>
          <Link 
            to="/settings" 
            className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
            onClick={() => setShowUserMenu(false)}
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
            <span>{userName}</span>
          </button>

          {showUserMenu && (
            <div className="user-menu">
              <Link to="/profile" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                <FaUser /> Profile
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