const zmq = require('zeromq');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const chartjsPluginDatalabels = require('chartjs-plugin-datalabels');


const width = 400; 
const height = 400; 
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  plugins: {
    modern: ['chartjs-plugin-datalabels'], 
  },
});


function calculateWinLoss(trades) {
  let totalWins = 0;
  let totalLosses = 0;

  trades.forEach((trade) => {
    const profitLoss = trade.exitPrice - trade.entryPrice;
    if (profitLoss > 0) {
      totalWins += profitLoss;
    } else if (profitLoss < 0) {
      totalLosses += Math.abs(profitLoss); 
    }
  });

  return { totalWins, totalLosses };
}


async function generatePieChart(winLossData) {
  const { totalWins, totalLosses } = winLossData;
  const data = {
    labels: [`Wins: $${totalWins.toFixed(2)}`, `Losses: $${totalLosses.toFixed(2)}`],
    datasets: [
      {
        data: [totalWins, totalLosses],
        backgroundColor: ['#4CAF50', '#F44336'], 
      },
    ],
  };

  const config = {
    type: 'pie',
    data: data,
    plugins: [chartjsPluginDatalabels], 
    options: {
      plugins: {
        datalabels: {
          color: 'white',
          font: {
            size: 16,
            weight: 'bold',
          },
          formatter: (value, context) => {
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(1); 
            return `${context.chart.data.labels[context.dataIndex]} (${percentage}%)`;
          },
        },
      },
    },
  };

  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(config);
  return imageBuffer.toString('base64');
}


(async () => {
  const sock = new zmq.Reply();

  try {
    await sock.bind('tcp://127.0.0.1:5558'); 
    console.log('Microservice D is running on port 5558...');

    for await (const [message] of sock) {
      try {
        const stockData = JSON.parse(message.toString());
        console.log('Received data:', stockData);

        const winLossData = calculateWinLoss(stockData.trades);

        const base64Chart = await generatePieChart(winLossData);
        console.log('Pie chart generated successfully.');

        await sock.send(JSON.stringify({ chart: base64Chart }));
      } catch (err) {
        console.error('Error processing request:', err.message);
        await sock.send(JSON.stringify({ error: 'Failed to process request.' }));
      }
    }
  } catch (err) {
    console.error('Error starting Microservice D:', err.message);
  }
})();
