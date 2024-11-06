import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../TradeFormPage.css';

function TradeFormPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tradeId = query.get('id');



  const [trade, setTrade] = useState({
    symbol: '',
    entryPrice: '',
    exitPrice: '',
    positionSize: '',
    tradeType: '',
    entryDate: '',
    exitDate: '',
  });

  useEffect(() => {
    if (tradeId) {
      axios
        .get(`/api/trades/${tradeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setTrade(res.data); 
        })
        .catch((err) => console.log("Error getting trade data:", err));
    }
  }, [tradeId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tradeId) {
        
        await axios.put(`/api/trades/${tradeId}`, trade, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        
        await axios.post('/api/trades', trade, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/');


    } catch (error) {
      console.log(error);
      alert('Error saving trade');
    }
  };

  return (
    <div className="trade-form-container">
      <button onClick={() => navigate('/')} className="back-button">
        Back to Homepage
      </button>
      <button onClick={logout} className="logout-button">Logout</button>

      <form onSubmit={handleSubmit} className="trade-form">
        <table className="trade-table">
          <tbody>
            <tr>
              <th>Symbol:</th>
                <td>
                <input
                  type="text"
                  value={trade.symbol}
                  onChange={(e) => setTrade({ ...trade, symbol: e.target.value })}
                  className="input-field"
                    />
                </td>
            </tr>

            <tr>
              <th>Entry Price:</th>
                <td>
                <input
                  type="number"
                  value={trade.entryPrice}
                  onChange={(e) => setTrade({ ...trade, entryPrice: e.target.value })}
                  className="input-field"
                  />
                </td>
            </tr>

            <tr>
              <th>Exit Price:</th>
                <td>
                <input
                  type="number"
                  value={trade.exitPrice}
                  onChange={(e) => setTrade({ ...trade, exitPrice: e.target.value })}
                  className="input-field"
                />
                </td>
            </tr>

            <tr>
              <th>Position Size:</th>
                <td>
                <input
                  type="number"
                  value={trade.positionSize}
                  onChange={(e) => setTrade({ ...trade, positionSize: e.target.value })}
                  className="input-field"
                />
                </td>
            </tr>

            <tr>
              <th>Trade Type:</th>
               <td>
                <input
                  type="text"
                  value={trade.tradeType}
                  onChange={(e) => setTrade({ ...trade, tradeType: e.target.value })}
                  className="input-field"
                  />
                </td>
            </tr>

            <tr>
              <th>Entry Date:</th>
                <td>
                <input
                  type="date"
                  value={trade.entryDate}
                  onChange={(e) => setTrade({ ...trade, entryDate: e.target.value })}
                  className="input-field"
                 />
                </td>
            </tr>

            <tr>
              <th>Exit Date:</th>
                <td>
                <input
                  type="date"
                  value={trade.exitDate}
                  onChange={(e) => setTrade({ ...trade, exitDate: e.target.value })}
                  className="input-field"
                    />
                </td>
            </tr>

            <tr>
              <td colSpan="2">
                <button type="submit" className="submit-button">Save Trade</button>
              </td>
            </tr>
          </tbody>
          </table>
        </form>
    </div>
  );
}

export default TradeFormPage;
