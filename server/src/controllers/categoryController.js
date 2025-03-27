const Collection = require('../models/collectionModel');

// Get all unique categories from collections
const getCategories = async (req, res) => {
  try {
    // Aggregate to get unique categories
    const categoriesData = await Collection.aggregate([
      { $unwind: "$category" },
      { $group: { _id: "$category" } },
      { $project: { _id: 0, name: "$_id" } },
      { $sort: { name: 1 } }
    ]);

    // Format the response
    const categories = categoriesData.map(cat => ({
      _id: cat.name.toLowerCase().replace(/\s+/g, '-'),
      name: cat.name
    }));

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

module.exports = {
  getCategories
};