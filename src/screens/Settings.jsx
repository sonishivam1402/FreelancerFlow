import React, { useState } from 'react';
import { FaSave, FaBell, FaEnvelope, FaClock } from 'react-icons/fa';
import '../styles/Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle settings save
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>
        <button className="btn-primary" onClick={handleSubmit}>
          <FaSave /> Save Changes
        </button>
      </header>

      <div className="settings-grid">
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