const express = require('express');
const ShopSettings = require('../models/ShopSettings');
const { protect } = require('../middleware/auth');

const router = express.Router();
const SETTINGS_KEY = 'main';

// @route  GET /api/shop-settings
// @desc   Get shop settings (public)
router.get('/', async (req, res) => {
    try {
        let settings = await ShopSettings.findOne({ key: SETTINGS_KEY });
        if (!settings) {
            settings = await ShopSettings.create({ key: SETTINGS_KEY });
        }
        res.json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  PUT /api/shop-settings
// @desc   Update shop settings (admin)
router.put('/', protect, async (req, res) => {
    try {
        const updates = { ...req.body, updatedAt: new Date() };
        delete updates.key; // Prevent key change

        let settings = await ShopSettings.findOneAndUpdate(
            { key: SETTINGS_KEY },
            updates,
            { new: true, upsert: true, runValidators: true }
        );

        res.json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
