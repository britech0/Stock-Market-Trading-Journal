require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const processRoutes = require('./routes/process');
//const microbRoutes = require('./routes/microb');//
//const microcRoutes = require('./routes/microc');//
const microdRoutes = require('./routes/microd.js');


// importing route
const authRoutes = require('./routes/auth');
const tradeRoutes = require('./routes/trades');
const contactRoutes = require('./routes/contact');

// Middleware
app.use(express.json());
app.use(cors());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/contact', contactRoutes)
app.use('/auth', authRoutes)
app.use('/process-stock-data', processRoutes);
//app.use('/microservice-b', microbRoutes);//
//app.use('/microservice-c', microcRoutes);//
app.use('/microservice-d', microdRoutes);


// mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)))
  .catch((err) => console.log(err));