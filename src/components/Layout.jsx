import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartLine, FaUserClock, FaCog } from 'react-icons/fa';
import { BsFileText } from 'react-icons/bs';

const Layout = ({ children }) => {
  const location = useLocation();

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
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 