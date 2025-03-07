import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
// import InquirySetup from "./screens/InquirySetup";
import FollowUpScheduler from "./screens/FollowUpScheduler";
import EmailTemplates from "./screens/EmailTemplates";
// import TemplatesManagement from "./screens/TemplatesManagement";
import Settings from "./screens/Settings";
import Layout from './components/Layout';
import "./App.css";
import ClientDetails from "./screens/ClientDetails";
import ClientTracking from "./screens/ClientTracking";
import ProtectedRoute from './components/ProtectedRoute';
import Signup from "./screens/Signup";
import Profile from "./screens/Profile";

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Other routes should be protected */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/follow-up" element={<ProtectedRoute><FollowUpScheduler /></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute><EmailTemplates /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/clients/:id" element={<ProtectedRoute><ClientDetails /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><ClientTracking /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;