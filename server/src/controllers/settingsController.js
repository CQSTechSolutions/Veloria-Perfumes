const Settings = require('../models/settingsModel');

// Get settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({});
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    updates.updatedAt = Date.now();

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create(updates);
    } else {
      settings = await Settings.findOneAndUpdate({}, updates, {
        new: true,
        runValidators: true
      });
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
};

module.exports = { getSettings, updateSettings }; 