import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import '../styles/NewEmailForm.css';

const NewEmailForm = ({ client, template, onClose, onSend }) => {
  const [formData, setFormData] = useState({
    to: client?.email || '',
    subject: template?.subject || '',
    body: template?.body || '',
    followUp: true,
    followUpDays: 2
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(formData);
  };

  return (
    <div className="email-form-overlay">
      <div className="email-form">
        <div className="email-form-header">
          <h2>New Email</h2>
          <button className="btn-icon" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="to">To</label>
            <input
              type="email"
              id="to"
              value={formData.to}
              onChange={(e) => setFormData({...formData, to: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="body">Message</label>
            <textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData({...formData, body: e.target.value})}
              required
              rows="12"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.followUp}
                onChange={(e) => setFormData({...formData, followUp: e.target.checked})}
              />
              Schedule follow-up if no response
            </label>
          </div>

          {formData.followUp && (
            <div className="form-group">
              <label htmlFor="followUpDays">Follow up after (days)</label>
              <input
                type="number"
                id="followUpDays"
                min="1"
                max="14"
                value={formData.followUpDays}
                onChange={(e) => setFormData({...formData, followUpDays: parseInt(e.target.value)})}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Send Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEmailForm; 