const express = require('express');
const Blog = require('../models/Blog');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route  GET /api/blogs
// @desc   Get all published blogs (public)
router.get('/', async (req, res) => {
    try {
        const { category, featured, search } = req.query;
        let query = { published: true };

        if (category) query.category = category;
        if (featured === 'true') query.featured = true;
        if (search) query.title = { $regex: search, $options: 'i' };

        const blogs = await Blog.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: blogs.length, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/blogs/all
// @desc   Get all blogs including drafts (admin)
router.get('/all', protect, async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json({ success: true, count: blogs.length, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/blogs/:id
// @desc   Get single blog by id or slug
router.get('/:id', async (req, res) => {
    try {
        let blog = null;
        // Try by ID first, then slug
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            blog = await Blog.findById(req.params.id);
        }
        if (!blog) {
            blog = await Blog.findOne({ slug: req.params.id, published: true });
        }
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  POST /api/blogs
// @desc   Create blog (admin)
router.post('/', protect, async (req, res) => {
    try {
        const { title, excerpt, content, coverImage, author, category, tags, published, featured, readTime } = req.body;

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Make slug unique
        let finalSlug = slug;
        const existing = await Blog.findOne({ slug });
        if (existing) {
            finalSlug = `${slug}-${Date.now()}`;
        }

        const blog = await Blog.create({
            title, slug: finalSlug, excerpt, content, coverImage,
            author: author || 'SpiceKart Team',
            category: category || 'General',
            tags: tags || [],
            published: published || false,
            featured: featured || false,
            readTime: readTime || 5,
        });

        res.status(201).json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  PUT /api/blogs/:id
// @desc   Update blog (admin)
router.put('/:id', protect, async (req, res) => {
    try {
        const updateData = { ...req.body, updatedAt: new Date() };
        // Regenerate slug if title changed
        if (req.body.title) {
            updateData.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        res.json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  DELETE /api/blogs/:id
// @desc   Delete blog (admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
