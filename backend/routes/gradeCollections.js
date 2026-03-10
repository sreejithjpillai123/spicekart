const express = require('express');
const GradeCollection = require('../models/GradeCollection');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Seed defaults if DB is empty
const defaultCollections = [
    {
        slug: 'purple', grade: 'Purple', sortOrder: 0,
        name: 'Purple Grade (8 mm & above) Cardamom',
        size: 'Pods of diameter 8mm & above',
        price: 1999, originalPrice: 3800, badgeColor: '#7b3fa0',
        origin: 'South India',
        speciality: 'GI-tagged Alleppey Green Aroma Lock Cardamom',
        usage: 'Versatile spice, chef recommended, ideal for the discerning home consumer',
        manufacturer: 'Emperor Akbar Cardamom · Dist. Theni, Tamil Nadu, India',
        images: ['https://www.emperorakbar.com/cdn/shop/files/EAC_Website_MISC-07_869af3c3-d169-449d-a9dc-1db16cf3e7a4_1080x.png?v=1625644495'],
        weights: [{ weight: '100 gm', price: 380, originalPrice: 760 }, { weight: '250 gm', price: 950, originalPrice: 1900 }, { weight: '500 gm', price: 1900, originalPrice: 3800 }, { weight: '1 kg', price: 3800, originalPrice: 7600 }, { weight: '5 kg', price: 19000, originalPrice: 38000 }],
        features: [{ icon: '🏅', label: 'Best of India' }, { icon: '📍', label: 'GI-Tagged Alleppey Green Cardamom' }, { icon: '🔒', label: 'Aroma Lock' }],
    },
    {
        slug: 'pink', grade: 'Pink', sortOrder: 1,
        name: 'Pink Grade (7.5 mm) Cardamom',
        size: 'Pods of diameter 7.5mm',
        price: 1799, originalPrice: 3400, badgeColor: '#d44a8a',
        origin: 'South India',
        speciality: 'GI-tagged Alleppey Green Aroma Lock Cardamom',
        usage: 'Perfect for chai, biryanis, and everyday cooking',
        manufacturer: 'Emperor Akbar Cardamom · Dist. Theni, Tamil Nadu, India',
        images: ['https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-14.png?v=1625572139'],
        weights: [{ weight: '100 gm', price: 250, originalPrice: 400 }, { weight: '250 gm', price: 600, originalPrice: 1000 }, { weight: '500 gm', price: 1100, originalPrice: 1900 }, { weight: '1 kg', price: 2100, originalPrice: 3600 }, { weight: '5 kg', price: 9500, originalPrice: 17000 }],
        features: [{ icon: '🏅', label: 'Best of India' }, { icon: '📍', label: 'GI-Tagged Alleppey Green Cardamom' }, { icon: '🔒', label: 'Aroma Lock' }],
    },
    {
        slug: 'green', grade: 'Green', sortOrder: 2,
        name: 'Green Grade (7 mm) Cardamom',
        size: 'Pods of diameter 7mm',
        price: 1599, originalPrice: 2999, badgeColor: '#4a6741',
        origin: 'South India',
        speciality: 'GI-tagged Alleppey Green Aroma Lock Cardamom',
        usage: 'Ideal for food manufacturers and hospitality industry',
        manufacturer: 'Emperor Akbar Cardamom · Dist. Theni, Tamil Nadu, India',
        images: ['https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-15.png?v=1625572246'],
        weights: [{ weight: '100 gm', price: 200, originalPrice: 350 }, { weight: '250 gm', price: 500, originalPrice: 850 }, { weight: '500 gm', price: 950, originalPrice: 1600 }, { weight: '1 kg', price: 1800, originalPrice: 3000 }, { weight: '5 kg', price: 8500, originalPrice: 14000 }],
        features: [{ icon: '🏅', label: 'Best of India' }, { icon: '📍', label: 'GI-Tagged Alleppey Green Cardamom' }, { icon: '🔒', label: 'Aroma Lock' }],
    },
    {
        slug: 'orange', grade: 'Orange', sortOrder: 3,
        name: 'Orange Grade (6.5 mm) Cardamom',
        size: 'Pods of diameter 6.5mm',
        price: 1399, originalPrice: 2600, badgeColor: '#e07b2a',
        origin: 'South India',
        speciality: 'GI-tagged Alleppey Green Aroma Lock Cardamom',
        usage: 'Used in spice blends, masalas, and large-scale food production',
        manufacturer: 'Emperor Akbar Cardamom · Dist. Theni, Tamil Nadu, India',
        images: ['https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-16.png?v=1625572290'],
        weights: [{ weight: '250 gm', price: 400, originalPrice: 650 }, { weight: '500 gm', price: 750, originalPrice: 1250 }, { weight: '1 kg', price: 1400, originalPrice: 2300 }, { weight: '5 kg', price: 6500, originalPrice: 11000 }, { weight: '25 kg', price: 30000, originalPrice: 50000 }],
        features: [{ icon: '🏅', label: 'Best of India' }, { icon: '📍', label: 'GI-Tagged Alleppey Green Cardamom' }, { icon: '🔒', label: 'Aroma Lock' }],
    },
    {
        slug: 'red', grade: 'Red', sortOrder: 4,
        name: 'Red Grade (6 mm) Cardamom',
        size: 'Pods of diameter 6mm',
        price: 1199, originalPrice: 2200, badgeColor: '#c0392b',
        origin: 'South India',
        speciality: 'GI-tagged Alleppey Green Aroma Lock Cardamom',
        usage: 'Bulk supply for exporters and spice traders worldwide',
        manufacturer: 'Emperor Akbar Cardamom · Dist. Theni, Tamil Nadu, India',
        images: ['https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-17.png?v=1625572334'],
        weights: [{ weight: '500 gm', price: 600, originalPrice: 1000 }, { weight: '1 kg', price: 1100, originalPrice: 1900 }, { weight: '5 kg', price: 5000, originalPrice: 9000 }, { weight: '25 kg', price: 23000, originalPrice: 42000 }, { weight: '50 kg', price: 44000, originalPrice: 80000 }],
        features: [{ icon: '🏅', label: 'Best of India' }, { icon: '📍', label: 'GI-Tagged Alleppey Green Cardamom' }, { icon: '🔒', label: 'Aroma Lock' }],
    },
];

async function seedDefaults() {
    const count = await GradeCollection.countDocuments();
    if (count === 0) {
        await GradeCollection.insertMany(defaultCollections);
        console.log('GradeCollection: seeded 5 default grades');
    }
}
seedDefaults().catch(console.error);

// ─── Public routes ────────────────────────────────────────────────────────────

// @route  GET /api/grade-collections
// @desc   Get all grade collections (public)
router.get('/', async (req, res) => {
    try {
        const collections = await GradeCollection.find({ isActive: true }).sort({ sortOrder: 1 });
        res.json({ success: true, collections });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/grade-collections/:slug
// @desc   Get single grade collection by slug (public)
router.get('/:slug', async (req, res) => {
    try {
        const collection = await GradeCollection.findOne({ slug: req.params.slug.toLowerCase() });
        if (!collection) {
            return res.status(404).json({ success: false, message: 'Grade collection not found' });
        }
        res.json({ success: true, collection });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── Admin routes (protected) ─────────────────────────────────────────────────

// @route  GET /api/grade-collections/admin/all
// @desc   Get all grade collections including inactive (admin)
router.get('/admin/all', protect, async (req, res) => {
    try {
        const collections = await GradeCollection.find().sort({ sortOrder: 1 });
        res.json({ success: true, collections });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  PUT /api/grade-collections/:slug
// @desc   Update grade collection by slug (admin)
router.put('/:slug', protect, async (req, res) => {
    try {
        const collection = await GradeCollection.findOneAndUpdate(
            { slug: req.params.slug.toLowerCase() },
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true, upsert: false }
        );
        if (!collection) {
            return res.status(404).json({ success: false, message: 'Grade collection not found' });
        }
        res.json({ success: true, collection });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
