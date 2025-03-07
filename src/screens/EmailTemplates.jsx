import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCopy } from 'react-icons/fa';
import '../styles/EmailTemplates.css';

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Initial Response',
      subject: 'Re: {project_type} Project Inquiry',
      body: `Hi {client_name},

Thank you for reaching out about your {project_type} project. I'd love to learn more about what you're looking to achieve.

Could you please provide more details about:
- Your project timeline
- Budget range
- Key features/requirements

I'll get back to you with a detailed proposal once I have this information.

Best regards,
{user_name}`,
      lastModified: '2024-03-10'
    },
    {
      id: 2,
      name: 'Follow-up 1',
      subject: 'Following up: {project_type} Project Discussion',
      body: `Hi {client_name},

I hope you're doing well. I'm following up on our previous conversation about the {project_type} project.

I'm still very interested in helping you bring this project to life. Would you like to schedule a quick call to discuss the details?

Best regards,
{user_name}`,
      lastModified: '2024-03-09'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const initialFormState = {
    name: '',
    subject: '',
    body: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData(template);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTemplate) {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id ? { ...formData, lastModified: new Date().toISOString().split('T')[0] } : t
      ));
    } else {
      setTemplates([...templates, {
        ...formData,
        id: templates.length + 1,
        lastModified: new Date().toISOString().split('T')[0]
      }]);
    }
    setShowForm(false);
    setFormData(initialFormState);
    setEditingTemplate(null);
  };

  return (
    <div className="templates-container">
      <header className="templates-header">
        <h1>Email Templates</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <FaPlus /> New Template
        </button>
      </header>

      {showForm && (
        <div className="template-form-container">
          <form onSubmit={handleSubmit} className="template-form">
            <h2>{editingTemplate ? 'Edit Template' : 'Create New Template'}</h2>
            
            <div className="form-group">
              <label htmlFor="name">Template Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Email Subject</label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="body">Email Body</label>
              <textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData({...formData, body: e.target.value})}
                required
                rows="10"
              />
            </div>

            <div className="template-variables">
              <h3>Available Variables:</h3>
              <div className="variables-list">
                <span className="variable">{'{client_name}'}</span>
                <span className="variable">{'{project_type}'}</span>
                <span className="variable">{'{user_name}'}</span>
                <span className="variable">{'{price_estimate}'}</span>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingTemplate ? 'Update Template' : 'Create Template'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingTemplate(null);
                  setFormData(initialFormState);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="templates-grid">
        {templates.map(template => (
          <div key={template.id} className="template-card">
            <div className="template-header">
              <h3>{template.name}</h3>
              <div className="template-actions">
                <button 
                  className="btn-icon" 
                  onClick={() => handleEdit(template)}
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button 
                  className="btn-icon"
                  onClick={() => {/* Add duplicate functionality */}}
                  title="Duplicate"
                >
                  <FaCopy />
                </button>
                <button 
                  className="btn-icon delete"
                  onClick={() => {/* Add delete functionality */}}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="template-subject">{template.subject}</div>
            <div className="template-preview">{template.body}</div>
            <div className="template-footer">
              Last modified: {template.lastModified}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailTemplates; 