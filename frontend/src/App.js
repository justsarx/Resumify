import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ResumeUpload from './components/ResumeUpload';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/upload">Upload Resume</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/upload" element={<ResumeUpload />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<ResumeUpload />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
