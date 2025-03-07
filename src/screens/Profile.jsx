import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FaUser, FaSave, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: user?.email || '',
    contact_no: '',
    company: '',
    position: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Only fetch profile data on initial load
    if (initialLoad) {
      const fetchUserProfile = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'Login', user.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfile({
              name: userData.name || '',
              email: userData.email || '',
              contact_no: userData.contact_no || '',
              company: userData.company || '',
              position: userData.position || ''
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setLoading(false);
          setInitialLoad(false);
        }
      };

      fetchUserProfile();
    } else {
      // If not initial load, just turn off loading
      setLoading(false);
    }
  }, [user, navigate, initialLoad]);

  // If no user, don't render anything (will redirect)
  if (!user) return null;

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);
    
    try {
      await updateDoc(doc(db, 'Login', user.userId), {
        name: profile.name,
        contact_no: profile.contact_no,
        company: profile.company,
        position: profile.position
      });

      setNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        type: 'error',
        message: 'Error updating profile. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <FaSpinner className="spinner" /> Loading profile...
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="header-content">
          <h1><FaUser /> Profile Settings</h1>
          <p>Manage your personal information</p>
        </div>
        <button 
          className="btn-save" 
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <>
              <FaSpinner className="spinner" /> Saving...
            </>
          ) : (
            <>
              <FaSave /> Save Changes
            </>
          )}
        </button>
      </div>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="profile-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="disabled"
            />
            <small>Email cannot be changed</small>
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="tel"
              value={profile.contact_no}
              onChange={(e) => handleInputChange('contact_no', e.target.value)}
              placeholder="Enter your contact number"
            />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Enter your company name"
            />
          </div>

          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              value={profile.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              placeholder="Enter your position/title"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile; 