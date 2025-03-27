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
const wishlistRoute = require('./src/routes/wishlistRoute');
const orderRoute = require('./src/routes/orderRoute');
const statsRoute = require('./src/routes/statsRoute');
const settingsRoute = require('./src/routes/settingsRoute');
const categoryRoute = require('./src/routes/categoryRoute'); // Add this line

dbConn();

const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [];
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  sameSite: 'None',
  secure: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/collection', collectionRoute);
app.use('/api/getStats', statsRoute);
app.use('/api/cart', cartRoute);
app.use('/api/wishlist', wishlistRoute);
app.use('/api/orders', orderRoute);
app.use('/api/settings', settingsRoute);
app.use('/api/categories', categoryRoute); // Add this line

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