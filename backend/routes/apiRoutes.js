router.post("/process-stock-data", async (req, res) => {
  console.log("Received request at /process-stock-data"); 
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const trades = await Trade.find({ userId });

    console.log("Fetched trades:", trades);

    if (!trades || trades.length === 0) {
      return res.status(404).json({ error: "No trades found for this user" });
    }

    const stockData = {
      userId,
      trades: trades.map(trade => ({
        _id: trade._id,
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice,
        stoplossPrice: trade.stoplossPrice,
      })),
    };

    console.log("Sending data to microservice:", stockData);

    const sock = new zmq.Request();
    await sock.connect("tcp://127.0.0.1:5555");
    console.log("Sending data to microservice:", stockData);

    await sock.send(JSON.stringify(stockData));

    const [response] = await sock.receive();
    const responseData = JSON.parse(response.toString());
    console.log("Received response from microservice:", responseData);

    res.json(responseData);
  } catch (error) {
    console.error("Error communicating with the microservice:", error);
    res.status(500).json({ error: "An error occurred while processing data" });
  }
});
