const Collection = require('../models/collectionModel');

const getCollections = async (req, res) => {
    try {
        // Initialize filter object
        let filter = {};
        
        // Filter by category if provided - make it case insensitive
        if (req.query.category) {
            filter.category = { $regex: new RegExp(req.query.category, 'i') };
        }
        
        // Add other potential filters as needed
        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: 'i' };
        }
        
        if (req.query.minPrice && req.query.maxPrice) {
            filter.price = { $gte: parseInt(req.query.minPrice), $lte: parseInt(req.query.maxPrice) };
        } else if (req.query.minPrice) {
            filter.price = { $gte: parseInt(req.query.minPrice) };
        } else if (req.query.maxPrice) {
            filter.price = { $lte: parseInt(req.query.maxPrice) };
        }
        
        // Sorting options
        let sort = {};
        if (req.query.sort) {
            switch(req.query.sort) {
                case 'price-asc':
                    sort = { price: 1 };
                    break;
                case 'price-desc':
                    sort = { price: -1 };
                    break;
                case 'newest':
                    sort = { createdAt: -1 };
                    break;
                case 'oldest':
                    sort = { createdAt: 1 };
                    break;
                case 'name-asc':
                    sort = { name: 1 };
                    break;
                case 'name-desc':
                    sort = { name: -1 };
                    break;
                default:
                    sort = { createdAt: -1 };
            }
        } else {
            // Default sorting
            sort = { createdAt: -1 };
        }
        
        console.log('Fetching collections with filter:', filter);
        const collections = await Collection.find(filter).sort(sort);
        res.status(200).json(collections);
    } catch (error) {
        console.error('Error fetching collections:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCollectionById = async (req, res) => {
    console.log(`getCollectionById called with ID: ${req.params.id}`);
    
    // Check if ID is undefined or not a valid ObjectId format
    if (!req.params.id || req.params.id === 'undefined') {
        console.log('Invalid ID parameter received');
        return res.status(400).json({ message: 'Invalid product ID' });
    }
    
    try {
        const collection = await Collection.findById(req.params.id);
        console.log('Collection found:', collection ? 'Yes' : 'No');
        
        if (!collection) {
            console.log('Collection not found, returning 404');
            return res.status(404).json({ message: 'Collection not found' });
        }
        
        console.log('Returning collection data');
        res.status(200).json(collection);
    } catch (error) {
        console.error('Error fetching collection by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createCollection = async (req, res) => {
        try {
        const collection = new Collection(req.body);
        await collection.save();
        res.status(201).json({ message: 'Collection created successfully', collection });
    } catch (error) {
        console.error('Error creating collection:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteCollection = async (req, res) => {
    try {
        await Collection.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Collection deleted successfully' });
    } catch (error) {
        console.error('Error deleting collection:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateCollection = async (req, res) => {
    try {
        const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Collection updated successfully', collection });
    } catch (error) {
        console.error('Error updating collection:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getCollections, getCollectionById, createCollection, deleteCollection, updateCollection };