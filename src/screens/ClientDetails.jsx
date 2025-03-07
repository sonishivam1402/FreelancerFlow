import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaClock, FaFileAlt, FaArrowLeft } from 'react-icons/fa';
import '../styles/ClientDetails.css';

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('communications');
  const [client, setClient] = useState(null);

  // Mock client database - in a real app, this would come from your backend
  const clientsDatabase = [
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 234 567 8900",
      company: "Tech Solutions Inc",
      projectType: "Website Development",
      budget: "$5,000 - $10,000",
      timeline: "3 months",
      status: "Pending",
      communications: [
        {
          id: 1,
          type: "email",
          direction: "received",
          date: "2024-03-10T10:30:00",
          subject: "Website Development Inquiry",
          content: "Hi, I'm interested in developing a new website for my business...",
        },
        {
          id: 2,
          type: "email",
          direction: "sent",
          date: "2024-03-10T14:45:00",
          subject: "Re: Website Development Inquiry",
          content: "Thank you for reaching out about your website project...",
        }
      ],
      notes: [
        {
          id: 1,
          date: "2024-03-10",
          content: "Client prefers modern design with minimal colors"
        }
      ]
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 345 678 9012",
      company: "Creative Designs Co",
      projectType: "Logo Design",
      budget: "$1,000 - $2,000",
      timeline: "2 weeks",
      status: "Follow-up 2 Scheduled",
      communications: [
        {
          id: 1,
          type: "email",
          direction: "received",
          date: "2024-03-08T09:15:00",
          subject: "Logo Design Project",
          content: "We need a new logo for our rebranding initiative...",
        }
      ],
      notes: [
        {
          id: 1,
          date: "2024-03-08",
          content: "Client wants to incorporate blue and green colors"
        }
      ]
    },
    // Add more clients matching your dashboard/tracking data
  ];

  useEffect(() => {
    // Find the client in our database
    const foundClient = clientsDatabase.find(c => c.id === id);
    if (foundClient) {
      setClient(foundClient);
    } else {
      // Handle client not found
      navigate('/clients');
    }
  }, [id, navigate]);

  if (!client) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="client-details">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      {/* Client Header */}
      <header className="client-header">
        <div className="client-info">
          <h1>{client.name}</h1>
          <span className={`status-badge ${client.status.toLowerCase().replace(' ', '-')}`}>
            {client.status}
          </span>
        </div>
        <button className="btn-primary">
          <FaEnvelope /> Send Email
        </button>
      </header>

      {/* Client Overview */}
      <div className="client-overview">
        <div className="overview-card">
          <FaEnvelope className="overview-icon" />
          <div>
            <label>Email</label>
            <p>{client.email}</p>
          </div>
        </div>
        <div className="overview-card">
          <FaPhone className="overview-icon" />
          <div>
            <label>Phone</label>
            <p>{client.phone}</p>
          </div>
        </div>
        <div className="overview-card">
          <FaFileAlt className="overview-icon" />
          <div>
            <label>Project Type</label>
            <p>{client.projectType}</p>
          </div>
        </div>
        <div className="overview-card">
          <FaClock className="overview-icon" />
          <div>
            <label>Timeline</label>
            <p>{client.timeline}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'communications' ? 'active' : ''}`}
          onClick={() => setActiveTab('communications')}
        >
          Communications
        </button>
        <button 
          className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'communications' && (
          <div className="communications-timeline">
            {client.communications.map(comm => (
              <div 
                key={comm.id} 
                className={`timeline-item ${comm.direction}`}
              >
                <div className="timeline-header">
                  <span className="timeline-date">
                    {new Date(comm.date).toLocaleString()}
                  </span>
                  <span className={`direction-badge ${comm.direction}`}>
                    {comm.direction === 'sent' ? 'Sent' : 'Received'}
                  </span>
                </div>
                <div className="timeline-content">
                  <h3>{comm.subject}</h3>
                  <p>{comm.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="notes-section">
            <div className="notes-header">
              <h3>Client Notes</h3>
              <button className="btn-secondary">Add Note</button>
            </div>
            <div className="notes-list">
              {client.notes.map(note => (
                <div key={note.id} className="note-item">
                  <div className="note-date">{note.date}</div>
                  <div className="note-content">{note.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetails; 