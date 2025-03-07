import React, { useState, useEffect } from "react";
import { FaEnvelope, FaUserClock, FaChartLine } from "react-icons/fa";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    followups: 0,
    responseRate: 0
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'clients'));
        const clientsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          last_contact: doc.data().last_contact?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
        }));
        
        setClients(clientsData);
        
        // Calculate stats
        const pending = clientsData.filter(client => client.Status === 'Pending').length;
        const followups = clientsData.filter(client => client.Status.includes('Follow-up')).length;
        const responded = clientsData.filter(client => client.Status === 'Responded').length;
        const responseRate = clientsData.length > 0 
          ? Math.round((responded / clientsData.length) * 100) 
          : 0;

        setStats({
          pending,
          followups,
          responseRate
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <>
      {loading ? (
        <div className="loading">Loading dashboard...</div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon pending">
                <FaUserClock />
              </div>
              <div className="stat-info">
                <h3>Pending Responses</h3>
                <p>{stats.pending}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon scheduled">
                <FaEnvelope />
              </div>
              <div className="stat-info">
                <h3>Scheduled Follow-ups</h3>
                <p>{stats.followups}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon responded">
                <FaChartLine />
              </div>
              <div className="stat-info">
                <h3>Response Rate</h3>
                <p>{stats.responseRate}%</p>
              </div>
            </div>
          </div>

          {/* Client Tracking Table */}
          <div className="tracking-section">
            <div className="section-header">
              <h2>Recent Client Communications</h2>
            </div>

            <div className="table-container">
              <table className="clients-table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Project Type</th>
                    <th>Last Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.slice(0, 5).map(client => (
                    <tr key={client.id}>
                      <td>
                        <Link to={`/clients/${client.id}`}>
                          {client.Name}
                        </Link>
                      </td>
                      <td>{client['Project Type']}</td>
                      <td>{new Date(client.last_contact).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${client.Status.toLowerCase().replace(' ', '-')}`}>
                          {client.Status}
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
      )}
    </>
  );
};

export default Dashboard;
