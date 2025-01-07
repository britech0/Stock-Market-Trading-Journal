const express = require('express');
const zmq = require('zeromq');
const router = express.Router();
const Trade = require('../models/Trade'); 


router.post('/', async (req, res) => {
  try {
    const { userId } = req.body;


    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }


    console.log('Fetching trades for userId:', userId);
    const trades = await Trade.find({ userId });

    if (!trades || trades.length === 0) {
      return res.status(404).json({ error: 'No trades found for this user' });
    }

  
    const stockData = {
      userId,
      trades: trades.map((trade) => ({
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice,
      })),
    };


    const sock = new zmq.Request();
    await sock.connect('tcp://127.0.0.1:5558'); 

    console.log('Sending data to Microservice D...');
    await sock.send(JSON.stringify(stockData));


    const [message] = await sock.receive();
    const responseData = JSON.parse(message.toString());

 
    if (!responseData.chart) {
      console.error('Error: Received invalid response from Microservice D:', responseData);
      return res.status(500).json({ error: 'Failed to generate chart' });
    }

    //Return the base64 image to the client
    res.json({ chart: responseData.chart });
  } catch (error) {
    console.error('Error in microservice-d route:', error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});

module.exports = router;
