import React, { useState, useEffect } from 'react';
import { FaSave, FaBell, FaEnvelope, FaClock, FaKey, FaUser } from 'react-icons/fa';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/Settings.css';

const Settings = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      email: user?.email || '',
      contact_no: '',
      company: '',
      position: ''
    },
    emailSettings: {
      fromName: '',
      emailSignature: '',
      defaultFollowUpDays: 2,
      maxFollowUps: 3
    },
    notifications: {
      emailNotifications: true,
      browserNotifications: false,
      dailyDigest: true
    },
    automation: {
      autoFollowUp: true,
      markRespondedAutomatically: true,
      workingHours: {
        start: '09:00',
        end: '17:00'
      }
    }
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'Login', user.userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setSettings(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              fullName: userData.name || '',
              phone: userData.contact_no || '',
              company: userData.company || '',
              position: userData.position || ''
            }
          }));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification(null);
    
    try {
      await updateDoc(doc(db, 'Login', user.userId), {
        fullName: settings.profile.fullName,
        phone: settings.profile.phone,
        company: settings.profile.company,
        position: settings.profile.position
      });

      setNotification({
        type: 'success',
        message: 'Settings saved successfully!'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setNotification({
        type: 'error',
        message: 'Error saving settings. Please try again.'
      });
    }
  };

  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>
        <button className="btn-primary" onClick={handleSubmit}>
          <FaSave /> Save Changes
        </button>
      </header>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="settings-grid">
        {/* Profile Settings */}
        <div className="settings-section">
          <div className="section-header">
            <FaUser className="section-icon" />
            <h2>Profile Settings</h2>
          </div>
          
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={settings.profile.fullName}
              onChange={(e) => setSettings({
                ...settings,
                profile: {
                  ...settings.profile,
                  fullName: e.target.value
                }
              })}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={settings.profile.email}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={settings.profile.phone}
              onChange={(e) => setSettings({
                ...settings,
                profile: {
                  ...settings.profile,
                  phone: e.target.value
                }
              })}
            />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              value={settings.profile.company}
              onChange={(e) => setSettings({
                ...settings,
                profile: {
                  ...settings.profile,
                  company: e.target.value
                }
              })}
            />
          </div>

          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              value={settings.profile.position}
              onChange={(e) => setSettings({
                ...settings,
                profile: {
                  ...settings.profile,
                  position: e.target.value
                }
              })}
            />
          </div>
        </div>

        {/* Email Settings */}
        <div className="settings-section">
          <div className="section-header">
            <FaEnvelope className="section-icon" />
            <h2>Email Settings</h2>
          </div>
          
          <div className="form-group">
            <label>From Name</label>
            <input
              type="text"
              value={settings.emailSettings.fromName}
              onChange={(e) => setSettings({
                ...settings,
                emailSettings: {
                  ...settings.emailSettings,
                  fromName: e.target.value
                }
              })}
            />
          </div>

          <div className="form-group">
            <label>Email Signature</label>
            <textarea
              rows="4"
              value={settings.emailSettings.emailSignature}
              onChange={(e) => setSettings({
                ...settings,
                emailSettings: {
                  ...settings.emailSettings,
                  emailSignature: e.target.value
                }
              })}
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-section">
          <div className="section-header">
            <FaBell className="section-icon" />
            <h2>Notifications</h2>
          </div>

          <div className="toggle-group">
            <label className="toggle-label">
              <span>Email Notifications</span>
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    emailNotifications: e.target.checked
                  }
                })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-group">
            <label className="toggle-label">
              <span>Browser Notifications</span>
              <input
                type="checkbox"
                checked={settings.notifications.browserNotifications}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    browserNotifications: e.target.checked
                  }
                })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Automation Settings */}
        <div className="settings-section">
          <div className="section-header">
            <FaClock className="section-icon" />
            <h2>Automation</h2>
          </div>

          <div className="form-group">
            <label>Default Follow-up Days</label>
            <input
              type="number"
              min="1"
              max="14"
              value={settings.emailSettings.defaultFollowUpDays}
              onChange={(e) => setSettings({
                ...settings,
                emailSettings: {
                  ...settings.emailSettings,
                  defaultFollowUpDays: parseInt(e.target.value)
                }
              })}
            />
          </div>

          <div className="form-group">
            <label>Working Hours</label>
            <div className="time-range">
              <input
                type="time"
                value={settings.automation.workingHours.start}
                onChange={(e) => setSettings({
                  ...settings,
                  automation: {
                    ...settings.automation,
                    workingHours: {
                      ...settings.automation.workingHours,
                      start: e.target.value
                    }
                  }
                })}
              />
              <span>to</span>
              <input
                type="time"
                value={settings.automation.workingHours.end}
                onChange={(e) => setSettings({
                  ...settings,
                  automation: {
                    ...settings.automation,
                    workingHours: {
                      ...settings.automation.workingHours,
                      end: e.target.value
                    }
                  }
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 