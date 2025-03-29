import express from 'express';
const router = express.Router();
import { addProduct, getAllProducts, getProductById } from '../controllers/productController.js';

router.post('/add', addProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);

export default router;