import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext'; 
import './MicroserviceDButton.css';

const MicroserviceDButton = () => {
  const { userId } = useAuth(); 
  const [chart, setChart] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const handleMicroserviceCall = async () => {
    if (!userId) {
      setError('User ID not found. Please log in.');
      return;
    }

    setLoading(true); 
    setError(null); 

    try {
      const res = await fetch('/microservice-d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }), 
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      if (data.chart) {
        setChart(data.chart); 
      } else {
        throw new Error('Chart data is missing in the response.');
      }
    } catch (err) {
      console.error('Error calling microservice:', err);
      setError(err.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button onClick={handleMicroserviceCall} className="microservice-d-button" disabled={loading}>
        {loading ? 'Processing...' : 'Generate Pie Chart'}
      </button>
      {chart && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h4>Pie Chart:</h4>
          <img
            src={`data:image/png;base64,${chart}`}
            alt="Pie Chart"
            style={{ width: '400px', height: '400px' }}
          />
        </div>
      )}
      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h4>Error:</h4>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default MicroserviceDButton;
