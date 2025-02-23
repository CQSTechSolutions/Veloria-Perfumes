const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
require('dotenv').config();

const dbConn = require("./src/utils/db.js");
const userRoute = require('./src/routes/userRoute');
const authRoute = require('./src/routes/authRoute');
const collectionRoute = require('./src/routes/collectionRoute');
const cartRoute = require('./src/routes/cartRoute');

dbConn();

const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [];
app.use(cors({
  origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/collection', collectionRoute);
app.use('/api/cart', cartRoute);

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});