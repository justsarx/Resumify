"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Alert, Card, Tag } from "antd";
import axios from "axios";

const JobRecommendations = ({ resumeId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/resumes/${resumeId}/recommended_jobs/`
        );
        setRecommendations(response.data);
      } catch (err) {
        setError("Failed to load job recommendations");
      } finally {
        setLoading(false);
      }
    };

    if (resumeId) {
      fetchRecommendations();
    }
  }, [resumeId]);

  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (recommendations.length === 0) {
    return (
      <Alert
        message="No Job Matches Found"
        description="We couldn't find any jobs that match your skills and experience. Try uploading your resume again or check back later."
        type="info"
        showIcon
      />
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Recommended Jobs</h3>
      {recommendations.map((job) => (
        <Card key={job.id} className="mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-medium text-gray-900">{job.title}</h4>
              <p className="text-sm text-gray-500">{job.company_name}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
            </div>
            <div className="text-right">
              <Tag color="blue">Match: {Math.round(job.matching_score * 100)}%</Tag>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">{job.description}</p>
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium text-gray-900">Matching Skills:</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {job.matching_keywords.map((keyword, index) => (
                <Tag key={index} color="green">
                  {keyword}
                </Tag>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <Link to={`/job/${job.id}`}>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View Job Details
              </button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default JobRecommendations; 