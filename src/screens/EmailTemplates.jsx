import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCopy } from 'react-icons/fa';
import '../styles/EmailTemplates.css';
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
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

  const fetchTemplates = async () => {
    try {
      const templatesRef = collection(db, 'emailTemplates');
      const querySnapshot = await getDocs(templatesRef);
      const templatesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched templates:', templatesData);
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await updateDoc(doc(db, 'emailTemplates', editingTemplate.id), {
          ...formData,
          lastModified: new Date().toISOString()
        });
      } else {
        await addDoc(collection(db, 'emailTemplates'), {
          ...formData,
          lastModified: new Date().toISOString()
        });
      }
      fetchTemplates();
      setShowForm(false);
      setFormData(initialFormState);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const initializeDefaultTemplates = async () => {
    try {
      const templatesRef = collection(db, 'emailTemplates');
      const defaultTemplates = [
        {
          name: 'Initial Response',
          subject: 'Thank you for your inquiry',
          body: `Dear {{clientName}},

Thank you for reaching out to us. We have received your inquiry and will review it shortly.

We typically respond within 24-48 hours with a detailed response.

Best regards,
{{userName}}
{{userCompany}}`,
          lastModified: new Date().toISOString()
        }
      ];

      const q = query(templatesRef, where('name', '==', 'Initial Response'));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        for (const template of defaultTemplates) {
          await addDoc(templatesRef, template);
        }
      }
    } catch (error) {
      console.error('Error initializing templates:', error);
    }
  };

  useEffect(() => {
    initializeDefaultTemplates();
    fetchTemplates();
  }, []);

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