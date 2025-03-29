import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";

// routes
import dbConn from "./src/utils/db.js";
import bestsellersRoutes from './src/routes/bestsellersRoutes.js';
import products from './src/routes/products.js';
import authRoutes from './src/routes/auth.js';

const app = express();
dotenv.config({ path: '.env.local' });
const port = process.env.PORT || 3000;
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
app.use(express.urlencoded({ extended: false }));

dbConn();

app.use('/api/bestsellers', bestsellersRoutes);
app.use('/api/products', products);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});