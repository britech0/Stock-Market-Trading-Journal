import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';
import TradesList from '../components/TradesList';
import ProfitLossChart from '../components/ProfitLossChart';
import { useNavigate} from 'react-router-dom';
import ProcessDataButton from '../components/ProcessDataButton';
import MicroserviceDButton from '../components/MicroserviceDButton';

import '../HomePage.css';

function HomePage() {
  const { token, logout } = useAuth();
  const [trades, setTrades] = useState([]);
  const [timeframe, setTimeframe] = useState('all');
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  //get trade data
  useEffect(() => {
    const fetchTrades = async () => {
      const res = await axios.get('/api/trades', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrades(res.data);
    };
    fetchTrades();
  }, [token]);

// timeframe for graph
  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      const res = await axios.get(`/api/trades/summary?timeframe=${timeframe}&t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummaryData(res.data);
      setLoading(false);
    };
    fetchSummary();
  }, [token, timeframe])


// navigation
  const addTrade = () => {
    navigate('./trade-form');
  }

  const contactPageNav = () => {
    navigate('./contact');
  }

  return (
    <div>

      <button onClick={logout} className="logout-button">Logout</button>
      <button onClick={contactPageNav} className="help-button">Help / Contact</button>

      <h1>Trading Journal</h1>


      <div>
        <button onClick={() => setTimeframe('3months')} className="timeframe-buttons">Last 3 Months</button>
        <button onClick={() => setTimeframe('6months')} className="timeframe-buttons" >Last 6 Months</button>
        <button onClick={() => setTimeframe('all')} className="timeframe-buttons" >All Time</button>
      </div>

      <div className='visual-container'>
      <ProfitLossChart data={summaryData} />
      <ProcessDataButton />
      <MicroserviceDButton />
      </div>

      <div className="add-Div">
      <button onClick={addTrade} className="Add-button">Add Trade</button>
      </div>
      
      <TradesList trades={trades} />
    </div>
  );
}

export default HomePage;