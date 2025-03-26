const Collection = require('../models/collectionModel');

const getCollections = async (req, res) => {
    try {
        const collections = await Collection.find({});
        res.status(200).json(collections);
    } catch (error) {
        console.error('Error fetching collections:', error);
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

module.exports = { getCollections, createCollection, deleteCollection };