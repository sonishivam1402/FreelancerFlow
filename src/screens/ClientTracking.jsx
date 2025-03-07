import React, { useState } from 'react';
import { FaFilter, FaSearch, FaUserPlus, FaFileExport, FaEye, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/ClientTracking.css';

const ClientTracking = () => {
  const navigate = useNavigate();
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      projectType: "Website Development",
      lastContact: "2024-03-10",
      nextFollowup: "2024-03-12",
      status: "Pending",
      tags: ["High Priority", "New Client"]
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      projectType: "Mobile App",
      lastContact: "2024-03-08",
      nextFollowup: "2024-03-15",
      status: "Active",
      tags: ["In Progress"]
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael@example.com",
      projectType: "Design",
      lastContact: "2024-03-09",
      nextFollowup: "2024-03-16",
      status: "Completed",
      tags: ["Logo Design", "Branding"]
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma@example.com",
      projectType: "Website Development",
      lastContact: "2024-03-11",
      nextFollowup: "2024-03-13",
      status: "Follow-up 1",
      tags: ["E-commerce", "Urgent"]
    },
    {
      id: 5,
      name: "David Brown",
      email: "david@example.com",
      projectType: "Mobile App",
      lastContact: "2024-03-07",
      nextFollowup: "2024-03-14",
      status: "Follow-up 2",
      tags: ["iOS App", "Android App"]
    },
    {
      id: 6,
      name: "Lisa Anderson",
      email: "lisa@example.com",
      projectType: "Design",
      lastContact: "2024-03-05",
      nextFollowup: "2024-03-12",
      status: "Pending",
      tags: ["UI/UX Design"]
    },
    {
      id: 7,
      name: "James Taylor",
      email: "james@example.com",
      projectType: "Website Development",
      lastContact: "2024-03-01",
      nextFollowup: "2024-03-15",
      status: "Active",
      tags: ["WordPress", "Maintenance"]
    },
    {
      id: 8,
      name: "Sophie Martinez",
      email: "sophie@example.com",
      projectType: "Mobile App",
      lastContact: "2024-03-06",
      nextFollowup: "2024-03-13",
      status: "Completed",
      tags: ["Flutter", "Cross-platform"]
    }
  ]);

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

  const filteredClients = clients.filter(client => {
    if (filters.status !== 'all' && client.status !== filters.status) return false;
    if (filters.projectType !== 'all' && client.projectType !== filters.projectType) return false;
    if (filters.searchQuery && !client.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleExport = () => {
    // Convert clients data to CSV
    const headers = ['Name', 'Email', 'Project Type', 'Last Contact', 'Next Follow-up', 'Status', 'Tags'];
    const csvData = clients.map(client => [
      client.name,
      client.email,
      client.projectType,
      new Date(client.lastContact).toLocaleDateString(),
      new Date(client.nextFollowup).toLocaleDateString(),
      client.status,
      client.tags.join(', ')
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'clients_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    const newId = Math.max(...clients.map(c => c.id)) + 1;
    const today = new Date().toISOString().split('T')[0];
    const followupDate = new Date();
    followupDate.setDate(followupDate.getDate() + 2);

    const clientToAdd = {
      ...newClient,
      id: newId,
      lastContact: today,
      nextFollowup: followupDate.toISOString().split('T')[0],
      status: 'Pending',
      tags: newClient.tags.length ? newClient.tags : ['New Client']
    };

    setClients([...clients, clientToAdd]);
    setShowAddClientModal(false);
    setNewClient({
      name: '',
      email: '',
      projectType: 'Website Development',
      tags: []
    });
  };

  return (
    <div className="client-tracking">
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
                <td>{client.name}</td>
                <td>{client.projectType}</td>
                <td>{new Date(client.lastContact).toLocaleDateString()}</td>
                <td>{new Date(client.nextFollowup).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${client.status.toLowerCase()}`}>
                    {client.status}
                  </span>
                </td>
                <td>
                  <div className="tags">
                    {client.tags.map((tag, index) => (
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
    </div>
  );
};

export default ClientTracking; 