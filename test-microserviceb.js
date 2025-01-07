const zmq = require('zeromq');

(async () => {
  const sock = new zmq.Request();

  await sock.connect('tcp://127.0.0.1:5556');
  console.log('Connected to microservice B');

  const stockData = {
    userId: "12345",
    trades: [
      {
        _id: "1",
        entryPrice: 100,
        exitPrice: 150,
        stoplossPrice: 90,
        positionSize: 10,
        tradeType: "BUY",
        entryDate: "2024-12-01",
        exitDate: "2024-12-02",
      },
      {
        _id: "2",
        entryPrice: 200,
        exitPrice: 250,
        stoplossPrice: 190,
        positionSize: 5,
        tradeType: "SELL",
        entryDate: "2024-12-03",
        exitDate: "2024-12-04",
      },
    ],
  };

  console.log('Sending stockData...');
  await sock.send(JSON.stringify(stockData));

  const [response] = await sock.receive();
  console.log('Received response:', JSON.parse(response.toString()));
})();