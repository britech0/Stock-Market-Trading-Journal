const express = require('express');
const zmq = require('zeromq');
const router = express.Router();
const Trade = require('../models/Trade');

router.post("/", async (req, res) => {

  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const trades = await Trade.find({ userId });


    if (!trades || trades.length === 0) {
      return res.status(404).json({ error: "No trades found for this user" });
    }

    //format data for microservice
    const stockData = {
      userId,
      trades: trades.map(trade => ({
        _id: trade._id,
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice,
        stoplossPrice: trade.stoplossPrice,
      })),
    };

    // Send data to teammate's microservice
    const sock = new zmq.Request();
    await sock.connect("tcp://127.0.0.1:5555");
    await sock.send(JSON.stringify(stockData));


    const [response] = await sock.receive();
    const responseData = JSON.parse(response.toString());

    // Send the response back to the frontend
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: `error occurred while processing: ${error.message}` });
  }
});

module.exports = router;
