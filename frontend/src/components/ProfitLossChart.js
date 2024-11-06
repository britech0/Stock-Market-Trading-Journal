import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import './ProfitLossChart.css'

// format date to dd-mm-yyyy
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

// Calc total profit/loss different from tradeslist, because different data initialized in homepage.js
function profitLossCalculation(data) {
  return data.reduce((total, item) => total + item.profitLoss, 0);
}

function ProfitLossChart({ data }) {
  const formattedData = data
    .map(item => ({
      ...item,
      date: formatDate(item.date)
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calc the total balance
  const totalPNL = profitLossCalculation(formattedData);
  const pnlClass = totalPNL > 0 ? 'green' : totalPNL < 0 ? 'red' : 'black';

  return (
    <div>
      <h2 className="chartTitle">
        Profit & Loss Chart:
        <span className={pnlClass}> ${totalPNL.toFixed(2)}</span>

        </h2>
      <LineChart width={600} height={300} data={formattedData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="profitLoss" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}

export default ProfitLossChart;


