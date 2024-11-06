const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');
const authenticateToken = require('../middleware/authenticateToken');

// Create a trade
router.post('/', authenticateToken, async (req, res) => {
  try {
    const trade = new Trade({ ...req.body, userId: req.user.userId });
    await trade.save();
    res.status(201).json(trade);
  } catch (error) {
    res.status(500).json({ message: 'Error when creating', error });
  }
});

// Get all trades
router.get('/', authenticateToken, async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.user.userId });
    res.json(trades);

  } catch (error) {
    res.status(500).json({ message: 'Error getting all trades', error });
  }
});

// Get Trades Summary (Profit/Loss over time)
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const { timeframe } = req.query; 
    const userId = req.user.userId;
    let dateRange;


    // timeframe change
    if (timeframe === '3months') {
      dateRange = new Date();
      dateRange.setMonth(dateRange.getMonth() - 3);

    } else if (timeframe === '6months') {
      dateRange = new Date();
      dateRange.setMonth(dateRange.getMonth() - 6);

    } else {
      dateRange = new Date(0);
    }

    const trades = await Trade.find({
      userId,
      exitDate: { $gte: dateRange },
    });

    // Calculate cumulative profit/loss over time
    const summary = trades.map((trade) => ({
      date: trade.exitDate,
      profitLoss: (trade.exitPrice - trade.entryPrice) * trade.positionSize * (trade.tradeType === 'sell' ? -1 : 1),
    }));

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error getting trade summary', error });
  }
});

// Update a trade by id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
  
    const trade = await Trade.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId }, 
      req.body, 
      { new: true }

    );

    // Can't find trade
    if (!trade) return res.status(404).json({ message: 'Trade not found' });

    res.json(trade);
  } catch (error) {
    res.status(500).json({ message: 'Error updating', error });
  }
});

// Delete a trade by id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const trade = await Trade.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!trade) return res.status(404).json({ message: 'Trade not found' });
    res.json({ message: 'Trade deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting trade', error });
  }
});


//find the trade by id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!trade) return res.status(404).json({ message: 'Trade not found' });
    res.json(trade);

  } catch (error) {
    console.error('unsuccessful finding trade:', error);
    res.status(500).json({ message: 'unsuccessful trade', error });
  }
});


module.exports = router;