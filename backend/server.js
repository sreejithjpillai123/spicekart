require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));
app.use('/admin', express.static('admin'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/subscribers', require('./routes/subscribers'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/shop-settings', require('./routes/shopSettings'));
app.use('/api/grade-collections', require('./routes/gradeCollections'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: '🌿 SpiceKart API is running!', timestamp: new Date() });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 SpiceKart Backend running on http://localhost:${PORT}`);
    console.log(`📋 Admin Panel: http://localhost:${PORT}`);
    console.log('✅ Connected with authentication!');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Kill the existing process and restart.`);
        process.exit(1);
    } else {
        throw err;
    }
});
