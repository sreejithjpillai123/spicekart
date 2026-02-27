const express = require('express');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route  GET /api/products
// @desc   Get all active products (public)
router.get('/', async (req, res) => {
    try {
        const { sort, category, search } = req.query;
        let query = { isActive: true };

        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc') sortOption = { price: 1 };
        else if (sort === 'price_desc') sortOption = { price: -1 };
        else if (sort === 'name_asc') sortOption = { name: 1 };

        const products = await Product.find(query).sort(sortOption);
        res.json({ success: true, count: products.length, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/products/all
// @desc   Get all products including inactive (admin)
router.get('/all', protect, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ success: true, count: products.length, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/products/:id
// @desc   Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  POST /api/products
// @desc   Create product (admin)
router.post('/', protect, async (req, res) => {
    try {
        const { name, description, price, originalPrice, badge, category,
            gradeColor, gradeAccent, stock, featured, isActive, sizes } = req.body;

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const existing = await Product.findOne({ slug });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Product with this name already exists' });
        }

        const product = await Product.create({
            name, slug, description, price: Number(price),
            originalPrice: originalPrice ? Number(originalPrice) : null,
            badge, category, gradeColor, gradeAccent,
            stock: Number(stock) || 0, featured, isActive, sizes,
        });

        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  PUT /api/products/:id
// @desc   Update product (admin)
router.put('/:id', protect, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  DELETE /api/products/:id
// @desc   Delete product (admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
