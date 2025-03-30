import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";

// routes
import dbConn from "./src/utils/db.js";
import bestsellersRoutes from './src/routes/bestsellersRoutes.js';
import products from './src/routes/products.js';
import authRoutes from './src/routes/auth.js';
import cartRoutes from './src/routes/cart.js';
import orderRoutes from './src/routes/orders.js';

const app = express();
dotenv.config({ path: '.env.local' });
const port = process.env.PORT || 3000;

// Set up CORS properly
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

dbConn();

app.use('/api/bestsellers', bestsellersRoutes);
app.use('/api/products', products);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});