import React, { useState, useEffect } from 'react';
import { FaFilter, FaSearch, FaUserPlus, FaFileExport, FaEye, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/ClientTracking.css';
import Notification from '../components/Notification';

const ClientTracking = () => {
  const navigate = useNavigate();
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    projectType: 'Website Development',
    tags: []
  });

  const [filters, setFilters] = useState({
    status: 'all',
    projectType: 'all',
    searchQuery: '',
    dateRange: 'all'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch clients from Firebase
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'clients'));
        const clientsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const lastContact = data.last_contact?.toDate() || new Date();
          
          return {
            id: doc.id,
            ...data,
            last_contact: lastContact.toISOString().split('T')[0]
          };
        });
        setClients(clientsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => {
    if (filters.status !== 'all' && client.status !== filters.status) return false;
    if (filters.projectType !== 'all' && client.projectType !== filters.projectType) return false;
    if (filters.searchQuery && !client.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleExport = () => {
    const headers = ['Name', 'Email', 'Project Type', 'Last Contact', 'Next Follow-up', 'Status', 'Tags'];
    const csvData = clients.map(client => [
      client.Name,
      client.Email,
      client['Project Type'],
      new Date(client.last_contact).toLocaleDateString(),
      getNextFollowup(client.last_contact),
      client.Status,
      client.Tags.join(', ')
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'clients_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'clients'), {
        Name: newClient.name,
        Email: newClient.email,
        Status: 'Pending',
        Tags: newClient.tags.length ? newClient.tags : ['New Client'],
        last_contact: serverTimestamp(),
        'Project Type': newClient.projectType
      });

      const now = new Date();
      const nextFollowup = new Date(now);
      nextFollowup.setDate(nextFollowup.getDate() + 2);

      const newClientData = {
        id: docRef.id,
        Name: newClient.name,
        Email: newClient.email,
        'Project Type': newClient.projectType,
        last_contact: now.toISOString().split('T')[0],
        Status: 'Pending',
        Tags: newClient.tags.length ? newClient.tags : ['New Client']
      };

      setClients(prevClients => [...prevClients, newClientData]);
      setShowAddClientModal(false);
      setNewClient({
        name: '',
        email: '',
        projectType: 'Website Development',
        tags: []
      });
      
      setNotification({
        message: 'Client added successfully!',
        type: 'success'
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);

    } catch (error) {
      console.error("Error adding client:", error);
      setNotification({
        message: 'Error adding client. Please try again.',
        type: 'error'
      });
    }
  };

  // Add a helper function to calculate next follow-up date
  const getNextFollowup = (lastContact) => {
    const nextFollowup = new Date(lastContact);
    nextFollowup.setDate(nextFollowup.getDate() + 2);
    return nextFollowup.toLocaleDateString();
  };

  return (
    <div className="client-tracking">
      {/* Show notification if exists */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {loading ? (
        <div className="loading">Loading clients...</div>
      ) : (
        <>
          {/* Header Section */}
          <div className="tracking-header">
            <h1>Client Tracking</h1>
            <div className="header-actions">
              <button className="btn-secondary" onClick={handleExport}>
                <FaFileExport /> Export
              </button>
              <button className="btn-primary" onClick={() => setShowAddClientModal(true)}>
                <FaUserPlus /> Add Client
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="search-filter-bar">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search clients..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
              />
            </div>
            
            <button 
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="advanced-filters">
              <div className="filter-group">
                <label>Status</label>
                <select 
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Project Type</label>
                <select
                  value={filters.projectType}
                  onChange={(e) => setFilters({...filters, projectType: e.target.value})}
                >
                  <option value="all">All Types</option>
                  <option value="Website Development">Website Development</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Design">Design</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          )}

          {/* Add Client Modal */}
          {showAddClientModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Add New Client</h2>
                <form onSubmit={handleAddClient}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      required
                      value={newClient.name}
                      onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      required
                      value={newClient.email}
                      onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Project Type</label>
                    <select
                      value={newClient.projectType}
                      onChange={(e) => setNewClient({...newClient, projectType: e.target.value})}
                    >
                      <option value="Website Development">Website Development</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={newClient.tags.join(', ')}
                      onChange={(e) => setNewClient({
                        ...newClient,
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                      })}
                      placeholder="e.g. High Priority, New Client"
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn-secondary" onClick={() => setShowAddClientModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Add Client
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Clients Table */}
          <div className="table-container">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Email</th>
                  <th>Project Type</th>
                  <th>Last Contact</th>
                  <th>Next Follow-up</th>
                  <th>Status</th>
                  <th>Tags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(client => (
                  <tr key={client.id}>
                    <td>{client.Name}</td>
                    <td>{client.Email}</td>
                    <td>{client['Project Type']}</td>
                    <td>{new Date(client.last_contact).toLocaleDateString()}</td>
                    <td>{getNextFollowup(client.last_contact)}</td>
                    <td>
                      <span className={`status-badge ${client.Status.toLowerCase()}`}>
                        {client.Status}
                      </span>
                    </td>
                    <td>
                      <div className="tags">
                        {client.Tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button 
                          className="btn-icon"
                          onClick={() => navigate(`/clients/${client.id}`)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="btn-icon"
                          onClick={() => navigate(`/clients/${client.id}/edit`)}
                          title="Edit Client"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientTracking; 