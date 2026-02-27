const express = require('express');
const Subscriber = require('../models/Subscriber');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route  POST /api/subscribers
// @desc   Subscribe to newsletter (public)
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const existing = await Subscriber.findOne({ email: email.toLowerCase() });
        if (existing) {
            if (!existing.isActive) {
                existing.isActive = true;
                await existing.save();
                return res.json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
            }
            return res.status(400).json({ success: false, message: 'This email is already subscribed.' });
        }

        const subscriber = await Subscriber.create({ email });
        res.status(201).json({ success: true, message: 'Thank you for subscribing!', subscriber });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/subscribers
// @desc   Get all subscribers (admin)
router.get('/', protect, async (req, res) => {
    try {
        const subscribers = await Subscriber.find({ isActive: true }).sort({ subscribedAt: -1 });
        res.json({ success: true, count: subscribers.length, subscribers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  DELETE /api/subscribers/:id
// @desc   Unsubscribe (admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        await Subscriber.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ success: true, message: 'Subscriber removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
