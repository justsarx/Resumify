import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/resumes/');
        // You can sort resumes by score if needed
        setResumes(response.data);
      } catch (err) {
        setError('Error fetching resumes.');
        console.error(err);
      }
    };
    fetchResumes();
  }, []);

  return (
    <div>
      <h2>Ranked Resumes</h2>
      {error && <p>{error}</p>}
      <ul>
        {resumes.map((resume) => (
          <li key={resume.id}>
            <strong>{resume.candidate_name}</strong> - Score: {resume.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
