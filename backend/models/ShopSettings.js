const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    label: { type: String, default: '' },
    img: { type: String, default: '' },
    imgH: { type: Number, default: 72 },
}, { _id: false });

const shopSettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    // Shop Hero / Banner
    heroBannerTitle: { type: String, default: "World's Best Cardamom" },
    heroBannerSubtitle: { type: String, default: 'Premium spices from Kerala' },
    // Section Labels
    sectionEyebrow: { type: String, default: 'Our Collection' },
    sectionTitle: { type: String, default: 'Premium Spice Range' },
    sectionBody: { type: String, default: 'Handpicked, sun-dried and carefully packaged to preserve every note of flavour and aroma.' },
    // Featured section
    featuredEnabled: { type: Boolean, default: true },
    // Shop categories filter
    enabledCategories: [{ type: String }],
    // Grading Section
    gradingTitle: { type: String, default: 'Graded to your Requirement' },
    gradingBody: { type: String, default: "'One size doesn't fit all' is true in the case of cardamom as well. Because of their multiple uses and benefits, cardamom pods of different sizes are used in different applications. That is why Emperor Akbar Cardamom is graded by size. However, the grading is never about quality. Whatever the size, quality remains world class." },
    gradingGrades: {
        type: [gradeSchema], default: [
            { label: 'Purple Grade', img: 'https://www.emperorakbar.com/cdn/shop/files/EAC_Website_MISC-07_869af3c3-d169-449d-a9dc-1db16cf3e7a4_1080x.png?v=1625644495', imgH: 90 },
            { label: 'Pink Grade', img: 'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-14.png?v=1625572139', imgH: 80 },
            { label: 'Green Grade', img: 'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-15.png?v=1625572246', imgH: 72 },
            { label: 'Orange Grade', img: 'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-16.png?v=1625572290', imgH: 64 },
            { label: 'Red Grade', img: 'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-17.png?v=1625572334', imgH: 56 },
        ]
    },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ShopSettings', shopSettingsSchema);

