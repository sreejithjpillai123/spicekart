require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Product = require('./models/Product');

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Admin.deleteMany({});
        await Product.deleteMany({});

        // Create Admin
        const admin = await Admin.create({
            name: 'SpiceKart Admin',
            email: process.env.ADMIN_EMAIL || 'admin@spicekart.com',
            password: process.env.ADMIN_PASSWORD || 'Admin@123',
            role: 'admin',
        });
        console.log(`✅ Admin created: ${admin.email}`);

        // Seed Products
        const products = [
            {
                name: 'Alleppey Green Cardamom',
                slug: 'alleppey-green-cardamom',
                description: 'Premium grade, hand-picked from the hills of Kerala. Intensely aromatic.',
                price: 899,
                originalPrice: null,
                badge: 'BEST SELLER',
                category: 'Cardamom',
                gradeColor: '#4a6741',
                gradeAccent: '#90c870',
                stock: 100,
                featured: true,
                isActive: true,
                images: ['https://e7.pngegg.com/pngimages/118/390/png-clipart-green-vegetable-lot-true-cardamom-indian-cuisine-black-cardamom-spice-spice-food-superfood.png'],
                sizes: [
                    { label: 'Standard', price: 899, stock: 100 },
                ],
            },
            {
                name: 'Malabar Black Pepper',
                slug: 'malabar-black-pepper',
                description: 'Bold, robust piperine-rich pepper from the legendary Malabar coast.',
                price: 499,
                originalPrice: null,
                badge: 'NEW',
                category: 'Pepper',
                gradeColor: '#2c2c2c',
                gradeAccent: '#555555',
                stock: 50,
                featured: true,
                isActive: true,
                images: ['https://th.bing.com/th/id/OIP.vQMtSfxkKuhqpq_akJUuzQAAAA?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3'],
                sizes: [
                    { label: 'Standard', price: 499, stock: 50 },
                ],
            },
            {
                name: 'White Pepper Whole',
                slug: 'white-pepper-whole',
                description: 'Delicate and earthy, perfect for light-coloured dishes and sauces.',
                price: 549,
                originalPrice: null,
                badge: null,
                category: 'Pepper Powder',
                gradeColor: '#f5f5dc',
                gradeAccent: '#dcdcdc',
                stock: 75,
                featured: true,
                isActive: true,
                images: ['https://th.bing.com/th/id/OIP.qnyM1obakgu-I7HZ-1Tk6gHaE8?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3'],
                sizes: [
                    { label: 'Standard', price: 549, stock: 75 },
                ],
            },
            {
                name: 'Purple Grade (8mm & above) Cardamom',
                slug: 'purple-grade-8mm-cardamom',
                description: 'Extra-large pods. Rich, intense aroma. Ideal for premium masala blends. Sourced from the finest cardamom estates in Alleppey, Kerala.',
                price: 329,
                originalPrice: 750,
                badge: 'SALE',
                category: 'Cardamom',
                gradeColor: '#8b4fa8',
                gradeAccent: '#d4a0e8',
                stock: 100,
                featured: false,
                isActive: true,
                sizes: [
                    { label: '50g', price: 329, stock: 50 },
                    { label: '100g', price: 599, stock: 30 },
                    { label: '250g', price: 1299, stock: 20 },
                ],
            },
            {
                name: 'Pink Grade (7.5mm & above) Cardamom',
                slug: 'pink-grade-7-5mm-cardamom',
                description: 'Large pods with exceptional oil content. Perfect for gourmet cooking. Hand-picked from premium estates.',
                price: 329,
                originalPrice: 650,
                badge: 'SOLD OUT',
                category: 'Cardamom',
                gradeColor: '#c03070',
                gradeAccent: '#f0a0c0',
                stock: 0,
                featured: false,
                isActive: true,
                sizes: [
                    { label: '50g', price: 329, stock: 0 },
                    { label: '100g', price: 599, stock: 0 },
                ],
            },
            {
                name: 'Green Grade (7-8mm) Cardamom',
                slug: 'green-grade-7-8mm-cardamom',
                description: 'Our most popular grade. Bold flavour, vibrant green colour, versatile use. The everyday spice for discerning cooks.',
                price: 299,
                originalPrice: 600,
                badge: 'SALE',
                category: 'Cardamom',
                gradeColor: '#3a7a28',
                gradeAccent: '#90c870',
                stock: 200,
                featured: false,
                isActive: true,
                sizes: [
                    { label: '50g', price: 299, stock: 100 },
                    { label: '100g', price: 549, stock: 60 },
                    { label: '250g', price: 1199, stock: 40 },
                ],
            },
            {
                name: 'Orange Grade (6.5-7.5mm) Cardamom',
                slug: 'orange-grade-6-5-7-5mm-cardamom',
                description: 'Medium-large pods, perfectly balanced aroma for teas and beverages. Excellent for chai blends.',
                price: 1899,
                originalPrice: 3000,
                badge: 'SOLD OUT',
                category: 'Cardamom',
                gradeColor: '#d06010',
                gradeAccent: '#f0a050',
                stock: 0,
                featured: false,
                isActive: true,
                sizes: [
                    { label: '500g', price: 1899, stock: 0 },
                    { label: '1kg', price: 3499, stock: 0 },
                ],
            },
            {
                name: 'Red Grade (6-7mm) Cardamom',
                slug: 'red-grade-6-7mm-cardamom',
                description: 'Classic medium pods — the everyday spice staple. Great for curries & rice. Aromatic and fresh.',
                price: 949,
                originalPrice: 1500,
                badge: 'SALE',
                category: 'Cardamom',
                gradeColor: '#b02020',
                gradeAccent: '#e07070',
                stock: 150,
                featured: false,
                isActive: true,
                sizes: [
                    { label: '100g', price: 949, stock: 80 },
                    { label: '250g', price: 2099, stock: 50 },
                    { label: '500g', price: 3899, stock: 20 },
                ],
            },
            {
                name: 'Emperor Akbar E-Gift Card',
                slug: 'emperor-akbar-e-gift-card',
                description: 'Give the gift of world-class cardamom. Redeemable on all products. The perfect gift for spice lovers.',
                price: 529,
                originalPrice: null,
                badge: null,
                category: 'Gift Cards',
                gradeColor: '#7c4daa',
                gradeAccent: '#f5d76e',
                stock: 999,
                featured: false,
                isActive: true,
                sizes: [
                    { label: '₹529', price: 529, stock: 999 },
                    { label: '₹1000', price: 1000, stock: 999 },
                    { label: '₹2000', price: 2000, stock: 999 },
                ],
            },
        ];

        for (const p of products) {
            await Product.create(p);
        }
        console.log(`✅ ${products.length} products seeded`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📧 Admin Email   : ${process.env.ADMIN_EMAIL || 'admin@spicekart.com'}`);
        console.log(`🔑 Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedData();
