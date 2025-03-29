import Product from '../models/product.js';

export const getAllBestsellers = async (req, res) => {
  try {
    const bestsellers = await Product.find({ isBestSeller: true })
      .sort({ createdAt: -1 });

    if (!bestsellers) {
      return res.status(404).json({
        success: false,
        error: 'No bestsellers found'
      });
    }

    if (bestsellers.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No bestsellers available'
      });
    }

    return res.status(200).json({
      success: true,
      count: bestsellers.length,
      data: bestsellers
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request parameters'
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid data format'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Server Error: Failed to fetch bestsellers'
    });
  }
};

// Add the new function to handle adding a product as bestseller
export const addBestSeller = async (req, res) => {
  try {
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Update the product to mark it as a bestseller
    product.isBestSeller = true;
    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product marked as bestseller successfully',
      data: product
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Server Error: Failed to mark product as bestseller'
    });
  }
};