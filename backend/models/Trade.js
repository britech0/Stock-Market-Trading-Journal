const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  symbol: String,
  entryPrice: Number,
  exitPrice: Number,
  stoplossPrice: Number,
  positionSize: Number,
  tradeType: String,
  entryDate: Date,
  exitDate: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Trade', tradeSchema);