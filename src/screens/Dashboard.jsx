import React, { useState } from "react";
import { FaEnvelope, FaUserClock, FaChartLine } from "react-icons/fa";
import "../styles/Dashboard.css";
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      lastContact: "2024-03-10",
      nextFollowup: "2024-03-12",
      status: "Pending",
      project: "Website Development"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      lastContact: "2024-03-08",
      nextFollowup: "2024-03-14",
      status: "Follow-up 2 Scheduled",
      project: "Logo Design"
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael@example.com",
      lastContact: "2024-03-09",
      nextFollowup: "2024-03-16",
      status: "Completed",
      project: "Brand Identity"
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma@example.com",
      lastContact: "2024-03-11",
      nextFollowup: "2024-03-13",
      status: "Follow-up 1 Scheduled",
      project: "E-commerce Website"
    },
    {
      id: 5,
      name: "David Brown",
      email: "david@example.com",
      lastContact: "2024-03-07",
      nextFollowup: "2024-03-14",
      status: "Pending",
      project: "Mobile App Development"
    },
    {
      id: 6,
      name: "Lisa Anderson",
      email: "lisa@example.com",
      lastContact: "2024-03-05",
      nextFollowup: "2024-03-12",
      status: "Responded",
      project: "UI/UX Design"
    }
  ]);

  const [statusFilter, setStatusFilter] = useState("all");

  const filteredClients = clients.filter(client => 
    statusFilter === "all" ? true : client.status === statusFilter
  );

  return (
    <>
      {/* Main Content */}
      <header className="content-header">
        <h1>Client Communications Dashboard</h1>
        <button className="btn-primary">
          <FaEnvelope /> New Email
        </button>
      </header>

      {/* Stats Overview */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon pending">
            <FaUserClock />
          </div>
          <div className="stat-info">
            <h3>Pending Responses</h3>
            <p>3</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon scheduled">
            <FaEnvelope />
          </div>
          <div className="stat-info">
            <h3>Scheduled Follow-ups</h3>
            <p>4</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon responded">
            <FaChartLine />
          </div>
          <div className="stat-info">
            <h3>Response Rate</h3>
            <p>75%</p>
          </div>
        </div>
      </div>

      {/* Client Tracking Table */}
      <div className="tracking-section">
        <div className="section-header">
          <h2>Client Communications</h2>
          <div className="filters">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Responded">Responded</option>
              <option value="Follow-up 1 Scheduled">Follow-up 1</option>
              <option value="Follow-up 2 Scheduled">Follow-up 2</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Project</th>
                <th>Email</th>
                <th>Last Contact</th>
                <th>Next Follow-up</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id}>
                  <td>
                    <Link to={`/clients/${client.id}`}>
                      {client.name}
                    </Link>
                  </td>
                  <td>{client.project}</td>
                  <td>{client.email}</td>
                  <td>{new Date(client.lastContact).toLocaleDateString()}</td>
                  <td>{new Date(client.nextFollowup).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${client.status.toLowerCase().replace(' ', '-')}`}>
                      {client.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="Send Email">
                        <FaEnvelope />
                      </button>
                      <button className="btn-icon" title="View History">
                        <FaChartLine />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
