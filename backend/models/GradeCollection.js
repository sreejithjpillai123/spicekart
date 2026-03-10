const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
    icon: { type: String, default: '🏅' },
    label: { type: String, default: '' },
}, { _id: false });

const weightPriceSchema = new mongoose.Schema({
    weight: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
}, { _id: false });

const gradeCollectionSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    grade: { type: String, required: true }, // e.g. "Purple"
    size: { type: String, default: '' },    // e.g. "Pods of diameter 8mm & above"
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null },
    badgeColor: { type: String, default: '#4a6741' },
    origin: { type: String, default: 'South India' },
    speciality: { type: String, default: 'GI-tagged Alleppey Green Aroma Lock Cardamom' },
    usage: { type: String, default: '' },
    manufacturer: { type: String, default: 'Emperor Akbar Cardamom · Dist. Theni, Tamil Nadu, India' },
    images: [{ type: String }],
    weights: { type: [weightPriceSchema] },
    features: {
        type: [featureSchema], default: [
            { icon: '🏅', label: 'Best of India' },
            { icon: '📍', label: 'GI-Tagged Alleppey Green Cardamom' },
            { icon: '🔒', label: 'Aroma Lock' },
        ]
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('GradeCollection', gradeCollectionSchema);
