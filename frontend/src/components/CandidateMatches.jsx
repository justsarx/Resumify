"use client";

import { useState, useEffect } from "react";
import { Alert, Card, Tag, Button, Spin } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import PropTypes from "prop-types";

const CandidateMatches = ({ jobId }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/resumes/find_candidates/?job_id=${jobId}`
      );
      setCandidates(response.data);
    } catch (error) {
      setError("Failed to load matching candidates");
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchCandidates();
    }
  }, [jobId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCandidates();
  };

  if (loading && !refreshing) {
    return <div className="text-center p-4"><Spin size="large" /></div>;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (candidates.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Matching Candidates</h3>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={refreshing}
          >
            Refresh
          </Button>
        </div>
        <Alert
          message="No Matching Candidates Found"
          description="We couldn't find any candidates that match your job requirements. Try adjusting the skills required or check back later."
          type="info"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Matching Candidates</h3>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          loading={refreshing}
        >
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {candidate.candidate_name}
                  </h4>
                  <p className="text-sm text-gray-500">{candidate.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Last updated: {new Date(candidate.last_updated).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <Tag color="blue" className="text-sm">
                    Match: {Math.round(candidate.matching_score * 100)}%
                  </Tag>
                </div>
              </div>
              <div className="flex-grow">
                <span className="text-sm font-medium text-gray-900">Matching Skills:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {candidate.matching_keywords.map((keyword, index) => (
                    <Tag key={index} color="green" className="text-sm">
                      {keyword}
                    </Tag>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  type="primary"
                  onClick={() => window.open(`mailto:${candidate.email}?subject=Regarding Your Application`)}
                  className="flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Candidate
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

CandidateMatches.propTypes = {
  jobId: PropTypes.string.isRequired
};

export default CandidateMatches; 