import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
// import InquirySetup from "./screens/InquirySetup";
import FollowUpScheduler from "./screens/FollowUpScheduler";
import EmailTemplates from "./screens/EmailTemplates";
// import TemplatesManagement from "./screens/TemplatesManagement";
// import Settings from "./screens/Settings";
import Layout from './components/Layout';
import "./App.css";
import ClientDetails from "./screens/ClientDetails";
import ClientTracking from "./screens/ClientTracking";
import Settings from "./screens/Settings";

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            {/* <Route path="/" element={<Login />} /> */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/inquiry-setup" element={<InquirySetup />} /> */}
            <Route path="/follow-up" element={<FollowUpScheduler />} />
            <Route path="/templates" element={<EmailTemplates />} />
            {/* <Route path="/templates" element={<TemplatesManagement />} /> */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/clients/:id" element={<ClientDetails />} />
            <Route path="/clients" element={<ClientTracking />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;