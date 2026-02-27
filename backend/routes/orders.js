const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route  POST /api/orders
// @desc   Create a new order (public - customers)
router.post('/', async (req, res) => {
    try {
        const { customer, items, subtotal, discount, shippingCharge, total, paymentMethod, notes } = req.body;

        if (!customer || !items || !items.length) {
            return res.status(400).json({ success: false, message: 'Customer details and items are required' });
        }

        const order = await Order.create({
            customer, items, subtotal, discount, shippingCharge, total, paymentMethod, notes
        });

        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/orders
// @desc   Get all orders (admin)
router.get('/', protect, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        let query = {};
        if (status) query.status = status;

        const skip = (Number(page) - 1) * Number(limit);
        const [orders, total] = await Promise.all([
            Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('items.product', 'name'),
            Order.countDocuments(query),
        ]);

        res.json({ success: true, orders, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/orders/stats
// @desc   Get order statistics (admin dashboard)
router.get('/stats', protect, async (req, res) => {
    try {
        const [
            totalOrders,
            pendingOrders,
            deliveredOrders,
            totalRevenueResult,
            recentOrders,
        ] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ status: 'Pending' }),
            Order.countDocuments({ status: 'Delivered' }),
            Order.aggregate([{ $group: { _id: null, revenue: { $sum: '$total' } } }]),
            Order.find().sort({ createdAt: -1 }).limit(5).select('orderNumber customer.name total status createdAt'),
        ]);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: today } } },
            { $group: { _id: null, revenue: { $sum: '$total' } } },
        ]);

        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() - i);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            const result = await Order.aggregate([
                { $match: { createdAt: { $gte: date, $lt: nextDate } } },
                { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
            ]);
            last7Days.push({
                date: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
                revenue: result[0]?.revenue || 0,
                orders: result[0]?.count || 0,
            });
        }

        res.json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                deliveredOrders,
                totalRevenue: totalRevenueResult[0]?.revenue || 0,
                todayRevenue: todayRevenue[0]?.revenue || 0,
                recentOrders,
                last7Days,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/orders/:id
// @desc   Get single order (admin)
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product', 'name price');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  PUT /api/orders/:id/status
// @desc   Update order status (admin)
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        const update = { updatedAt: new Date() };
        if (status) update.status = status;
        if (paymentStatus) update.paymentStatus = paymentStatus;

        const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
