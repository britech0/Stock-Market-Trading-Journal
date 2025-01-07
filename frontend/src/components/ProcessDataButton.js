import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import './ProcessDataButton.css';

const ProcessDataButton = () => {
  const { userId, token } = useAuth(); 
  const [result, setResult] = useState(null);

  const handleProcessData = async () => {
    if (!userId) {
      console.error('No user ID found. Please log in.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/process-stock-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error processing stock data:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button onClick={handleProcessData} className="process-data-button">
        Process My Trades
      </button>
      {result && (
        <div className="result-box">
          <h4>Processed Results</h4>
          <div className="result-content">
            <p><strong>Average Performance:</strong> {result.averagePerformance}</p>
            <p><strong>Break-Even Win Rate:</strong> {result.breakEvenWinRate}</p>
            <p><strong>Current Win Rate:</strong> {result.currentWinRate}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessDataButton;
