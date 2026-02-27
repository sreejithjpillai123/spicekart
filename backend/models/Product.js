const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null },
    badge: { type: String, enum: ['SALE', 'SOLD OUT', 'NEW', 'BEST SELLER', null], default: null },
    category: { type: String, default: 'Cardamom' },
    gradeColor: { type: String, default: '#4a6741' },
    gradeAccent: { type: String, default: '#90c870' },
    stock: { type: Number, default: 0 },
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sizes: [
        {
            label: String,
            price: Number,
            stock: Number,
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

productSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Product', productSchema);
