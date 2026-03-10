const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const connectDB = require('./config/db');

const ShopSettings = require('./models/ShopSettings');

async function cleanSettings() {
    await connectDB();

    const settings = await ShopSettings.findOne();
    if (settings) {
        if (settings.gradingGrades) {
            settings.gradingGrades = settings.gradingGrades.map(g => {
                return {
                    label: g.label,
                    img: g.img,
                    imgH: g.imgH
                };
            });
            await settings.save();
            console.log('✅ Cleaned up old size/badgeColor fields from ShopSettings');
        }
    }

    process.exit(0);
}
cleanSettings();
