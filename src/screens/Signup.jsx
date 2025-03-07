import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FaEnvelope, FaLock, FaUser, FaPhone, FaBuilding } from 'react-icons/fa';
import '../styles/Login.css'; // We'll reuse login styles

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    contact_no: '',
    company: '',
    position: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Add new user to Login collection
      const docRef = await addDoc(collection(db, 'Login'), {
        email: formData.email,
        password: formData.password, // In a real app, you should hash the password
        name: formData.name,
        contact_no: formData.contact_no,
        company: formData.company,
        position: formData.position,
        createdOn: new Date(),
        last_login: new Date()
      });

      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        userId: docRef.id
      }));

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      setError('Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content signup-content">
        <div className="login-header">
          <h1>Create Account</h1>
          <p>Join FreelanceFlow to manage your clients effectively</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength="6"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              <FaPhone className="input-icon" />
              <input
                type="tel"
                placeholder="Contact Number"
                value={formData.contact_no}
                onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              <FaBuilding className="input-icon" />
              <input
                type="text"
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Position/Title"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="form-footer signup-footer">
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup; 