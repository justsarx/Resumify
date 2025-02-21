import React, { useState } from 'react';
import axios from 'axios';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [email, setEmail] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !candidateName || !email) {
      setUploadStatus('All fields are required!');
      return;
    }

    const formData = new FormData();
    formData.append('resume_file', file);
    formData.append('candidate_name', candidateName);
    formData.append('email', email);

    try {
      const response = await axios.post('http://localhost:8000/api/resumes/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadStatus('Upload successful!');
      console.log('Uploaded resume:', response.data);
    } catch (error) {
      setUploadStatus('Upload failed.');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Upload Resume</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Candidate Name:</label>
          <input
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Resume File:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit">Upload</button>
      </form>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default ResumeUpload;
