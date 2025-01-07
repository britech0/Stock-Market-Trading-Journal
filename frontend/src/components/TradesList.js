import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import './TradesList.css'; 
import ProfitLossChart from './ProfitLossChart';

function TradesList({ trades }) {
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trade? The trade entry will be deleted permanently')) {
      await axios.delete(`/api/trades/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload();
    }
  };

  const handleEdit = (id) => {
    navigate(`/trade-form?id=${id}`);
  };

  // Format date to dd-mm-yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Calculate overall profit/loss
  const totalPNL = trades.reduce((total, { entryPrice = 0, exitPrice = 0, positionSize = 0 }) => 
    total + (exitPrice - entryPrice) * positionSize, 0
  );  

  return (
    <div>
      <table className="trades-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Entry Price</th>
            <th>Exit Price</th>
            <th>Stoploss Price</th>
            <th>Position Size</th>
            <th>PnL</th> 
            <th>Trade Type</th>
            <th>Entry Date</th>
            <th>Exit Date</th>
            <th className="action-column" colSpan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {trades.length > 0 ? (
            trades.map((trade) => {

              {/*have to calculate pnl then insert into table */}
              const tradePNL = (trade.exitPrice - trade.entryPrice) * trade.positionSize;
              
              return (
                <tr key={trade._id}>
                  <td>{trade.symbol}</td>
                  <td>{trade.entryPrice}</td>
                  <td>{trade.exitPrice}</td>
                  <td>{trade.stoplossPrice}</td>
                  <td>{trade.positionSize}</td>
                  <td>${tradePNL.toFixed(2)}</td>
                  <td>{trade.tradeType}</td>
                  <td>{formatDate(trade.entryDate)}</td>
                  <td>{formatDate(trade.exitDate)}</td>
                  <td>
                    <button className="trades-edit-button" onClick={() => handleEdit(trade._id)}>Edit</button>
                  </td>
                  <td>
                    <button className="trades-delete-button" onClick={() => handleDelete(trade._id)}>Delete</button>
                  </td>
                </tr>
              );
            })
            ) : (
            <tr>
              <td colSpan="9">No trades available</td>
            </tr>
            )}
          </tbody>
      </table>
      <div>
        Overall PNL: ${totalPNL.toFixed(2)}
      </div>
    </div>
  );
  }

export default TradesList;
