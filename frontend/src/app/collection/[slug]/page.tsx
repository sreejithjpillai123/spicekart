'use client';
import Navbar from '../../components/Navbar';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { getGradeCollection, getGradeCollections, type GradeCollectionData } from '../../lib/api';

// ─── Static Fallback Data ─────────────────────────────────────────────────────
const staticGradeData: Record<string, GradeCollectionData> = {
    purple: { slug: 'purple', name: 'Purple Grade (8 mm & above) Cardamom', grade: 'Purple', size: 'Pods of diameter 8mm & above', price: 1999, originalPrice: 3800, badgeColor: '#7b3fa0', origin: 'South India', speciality: 'GI-tagged Alleppey Green Aroma Lock Cardamom', usage: 'Versatile spice, chef recommended, ideal for the discerning home consumer', manufacturer: 'Emperor Akbar Cardamom · Dist. Theni, Tamil Nadu, India', images: ['https://www.emperorakbar.com/cdn/shop/files/EAC_Website_MISC-07_869af3c3-d169-449d-a9dc-1db16cf3e7a4_1080x.png?v=1625644495'], weights: [{ weight: '100 gm', price: 380, originalPrice: 760 }, { weight: '250 gm', price: 950, originalPrice: 1900 }, { weight: '500 gm', price: 1900, originalPrice: 3800 }, { weight: '1 kg', price: 3800, originalPrice: 7600 }, { weight: '5 kg', price: 19000, originalPrice: 38000 }], features: [{ icon: '🏅', label: 'Best of India' }, { icon: '📍', label: 'GI-Tagged Alleppey Green Cardamom' }, { icon: '🔒', label: 'Aroma Lock' }], isActive: true, sortOrder: 0 },
    pink: { slug: 'pink', name: 'Pink Grade (7.5 mm) Cardamom', grade: 'Pink', size: 'Pods of diameter 7.5mm', price: 1799, originalPrice: 3400, badgeColor: '#d44a8a', origin: 'South India', speciality: 'GI-tagged Alleppey Green Aroma Lock Cardamom', usage: 'Perfect for chai, biryanis, and everyday cooking', manufacturer: 'Emperor Akbar Cardamom · Dist. Theni, Tamil Nadu, India', images: ['https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-14.png?v=1625572139'], weights: [{ weight: '100 gm', price: 250, originalPrice: 400 }, { weight: '250 gm', price: 600, originalPrice: 1000 }, { weight: '500 gm', price: 1100, originalPrice: 1900 }, { weight: '1 kg', price: 2100, originalPrice: 3600 }, { weight: '5 kg', price: 9500, originalPrice: 17000 }], features: [{ icon: '🏅', label: 'Best of India' }, { icon: '📍', label: 'GI-Tagged Alleppey Green Cardamom' }, { icon: '🔒', label: 'Aroma Lock' }], isActive: true, sortOrder: 1 },
    green: { slug: 'green', name: 'Green Grade (7 mm) Cardamom', grade: 'Green', size: 'Pods of diameter 7mm', price: 1599, originalPrice: 2999, badgeColor: '#4a6741', origin: 'South India', speciality: 'GI-tagged Alleppey Green Aroma Lock Cardamom', usage: 'Ideal for food manufacturers and hospitality industry', manufacturer: 'Emperor Akbar Cardamom · Dist. Theni, Tamil Nadu, India', images: ['https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-15.png?v=1625572246'], weights: [{ weight: '100 gm', price: 200, originalPrice: 350 }, { weight: '250 gm', price: 500, originalPrice: 850 }, { weight: '500 gm', price: 950, originalPrice: 1600 }, { weight: '1 kg', price: 1800, originalPrice: 3000 }, { weight: '5 kg', price: 8500, originalPrice: 14000 }], features: [{ icon: '🏅', label: 'Best of India' }, { icon: '📍', label: 'GI-Tagged Alleppey Green Cardamom' }, { icon: '🔒', label: 'Aroma Lock' }], isActive: true, sortOrder: 2 },
    orange: { slug: 'orange', name: 'Orange Grade (6.5 mm) Cardamom', grade: 'Orange', size: 'Pods of diameter 6.5mm', price: 1399, originalPrice: 2600, badgeColor: '#e07b2a', origin: 'South India', speciality: 'GI-tagged Alleppey Green Aroma Lock Cardamom', usage: 'Used in spice blends, masalas, and large-scale food production', manufacturer: 'Emperor Akbar Cardamom · Dist. Theni, Tamil Nadu, India', images: ['https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-16.png?v=1625572290'], weights: [{ weight: '250 gm', price: 400, originalPrice: 650 }, { weight: '500 gm', price: 750, originalPrice: 1250 }, { weight: '1 kg', price: 1400, originalPrice: 2300 }, { weight: '5 kg', price: 6500, originalPrice: 11000 }, { weight: '25 kg', price: 30000, originalPrice: 50000 }], features: [{ icon: '🏅', label: 'Best of India' }, { icon: '📍', label: 'GI-Tagged Alleppey Green Cardamom' }, { icon: '🔒', label: 'Aroma Lock' }], isActive: true, sortOrder: 3 },
    red: { slug: 'red', name: 'Red Grade (6 mm) Cardamom', grade: 'Red', size: 'Pods of diameter 6mm', price: 1199, originalPrice: 2200, badgeColor: '#c0392b', origin: 'South India', speciality: 'GI-tagged Alleppey Green Aroma Lock Cardamom', usage: 'Bulk supply for exporters and spice traders worldwide', manufacturer: 'Emperor Akbar Cardamom · Dist. Theni, Tamil Nadu, India', images: ['https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-17.png?v=1625572334'], weights: [{ weight: '500 gm', price: 600, originalPrice: 1000 }, { weight: '1 kg', price: 1100, originalPrice: 1900 }, { weight: '5 kg', price: 5000, originalPrice: 9000 }, { weight: '25 kg', price: 23000, originalPrice: 42000 }, { weight: '50 kg', price: 44000, originalPrice: 80000 }], features: [{ icon: '🏅', label: 'Best of India' }, { icon: '📍', label: 'GI-Tagged Alleppey Green Cardamom' }, { icon: '🔒', label: 'Aroma Lock' }], isActive: true, sortOrder: 4 },
};

const staticSlugOrder = ['purple', 'pink', 'green', 'orange', 'red'];

// ─── Delivery dates helper ──────────────────────────────────────────────────
function getDeliveryDates() {
    const today = new Date();
    const fmt = (d: Date) => d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const add = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return d; };
    return {
        ordered: fmt(today),
        readyFrom: fmt(add(2)),
        readyTo: fmt(add(4)),
        deliveredFrom: fmt(add(2)),
        deliveredTo: fmt(add(7)),
    };
}

export default function CollectionPage() {
    const params = useParams();
    const slug = typeof params.slug === 'string' ? params.slug.toLowerCase() : '';
    const { addToCart } = useCart();

    const [grade, setGrade] = useState<GradeCollectionData | null>(staticGradeData[slug] || null);
    const [allGrades, setAllGrades] = useState<GradeCollectionData[]>(Object.values(staticGradeData));
    const [loading, setLoading] = useState(true);
    const [selectedWeight, setSelectedWeight] = useState('');
    const [qty, setQty] = useState(1);
    const [activeImg, setActiveImg] = useState(0); 
    const [added, setAdded] = useState(false);

    useEffect(() => {
        setLoading(true);
        // Fetch this grade's data from API
        getGradeCollection(slug)
            .then(data => {
                setGrade(data);
                const w = data.weights[2] || data.weights[0];
                if (w) setSelectedWeight(w.weight);
            })
            .catch(() => {
                const fb = staticGradeData[slug];
                if (fb) {
                    setGrade(fb);
                    const w = fb.weights[2] || fb.weights[0];
                    if (w) setSelectedWeight(w.weight);
                }
            })
            .finally(() => setLoading(false));

        // Fetch all grades for the "Explore Other Grades" strip
        getGradeCollections()
            .then(data => { if (data.length > 0) setAllGrades(data); })
            .catch(() => { /* keep static */ });
    }, [slug]);

    useEffect(() => {
        if (grade && !selectedWeight) {
            const w = grade.weights[2] || grade.weights[0];
            if (w) setSelectedWeight(w.weight);
        }
    }, [grade]);

    const slugOrder = allGrades.map(g => g.slug);
    const currentIdx = slugOrder.indexOf(slug);
    const prevSlug = currentIdx > 0 ? slugOrder[currentIdx - 1] : null;
    const nextSlug = currentIdx < slugOrder.length - 1 ? slugOrder[currentIdx + 1] : null;
    const dates = getDeliveryDates();

    if (loading && !grade) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Jost, sans-serif' }}>
                <div style={{ textAlign: 'center', color: '#4a6741' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px', animation: 'spin 1s linear infinite' }}>🌿</div>
                    <p>Loading…</p>
                </div>
            </div>
        );
    }

    if (!grade) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Jost, sans-serif' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
                    <h2 style={{ color: '#4a6741' }}>Grade not found</h2>
                    <Link href="/" style={{ color: '#4a6741' }}>← Back to Home</Link>
                </div>
            </div>
        );
    }

    const activeWeightObj = grade.weights.find(w => w.weight === selectedWeight) || grade.weights[0];
    const currentPrice = activeWeightObj ? activeWeightObj.price : grade.price;
    const currentOriginalPrice = activeWeightObj ? activeWeightObj.originalPrice : grade.originalPrice;

    const handleAddToCart = () => {
        addToCart({
            _id: `grade-${slug}-${selectedWeight}`,
            name: `${grade.name} (${selectedWeight})`,
            slug,
            description: grade.usage,
            price: currentPrice,
            originalPrice: currentOriginalPrice,
            badge: null,
            category: 'Cardamom',
            gradeColor: grade.badgeColor,
            gradeAccent: grade.badgeColor,
            stock: 100,
            featured: false,
            isActive: true,
            images: grade.images,
            sizes: [],
            createdAt: '',
        }, qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const discount = currentOriginalPrice > 0
        ? Math.round((1 - currentPrice / currentOriginalPrice) * 100)
        : 0;

    return (
        <>
            <Navbar />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Jost:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Jost', sans-serif; background: #fff; }
                .col-page { min-height: 100vh; background: #fff; padding-top: 80px; }
                
                /* Breadcrumb */
                .breadcrumb { display: flex; align-items: center; gap: 8px; padding: 18px 48px; font-size: 12px; color: #888; font-family: 'Jost', sans-serif; border-bottom: 1px solid #f0f0f0; justify-content: space-between; }
                .breadcrumb-left { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
                .breadcrumb a { color: #888; text-decoration: none; transition: color 0.2s; }
                .breadcrumb a:hover { color: #4a6741; }
                .breadcrumb span { color: #4a6741; font-weight: 500; }
                .breadcrumb-nav { display: flex; align-items: center; gap: 16px; font-size: 12px; }
                .breadcrumb-nav a { color: #888; text-decoration: none; display: flex; align-items: center; gap: 4px; transition: color 0.2s; }
                .breadcrumb-nav a:hover { color: #4a6741; }

                /* Main product layout */
                .product-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 0; max-width: 1200px; margin: 0 auto; padding: 48px 48px 0; }
                @media (max-width: 768px) { .product-layout { grid-template-columns: 1fr; padding: 24px 20px 0; } .breadcrumb { padding: 14px 20px; } }

                /* Gallery */
                .gallery-main { position: relative; background: #f8f6f2; border-radius: 4px; overflow: hidden; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
                .gallery-main img { width: 100%; height: 100%; object-fit: contain; padding: 40px; transition: transform 0.4s ease; }
                .gallery-main img:hover { transform: scale(1.04); }
                .gallery-thumbs { display: flex; gap: 8px; flex-wrap: wrap; }
                .gallery-thumb { width: 72px; height: 72px; border-radius: 4px; overflow: hidden; cursor: pointer; border: 2px solid transparent; background: #f8f6f2; display: flex; align-items: center; justify-content: center; transition: border-color 0.2s; padding: 4px; }
                .gallery-thumb.active { border-color: #4a6741; }
                .gallery-thumb img { width: 100%; height: 100%; object-fit: contain; }

                /* Right panel */
                .product-info { padding: 0 0 0 56px; }
                @media (max-width: 768px) { .product-info { padding: 32px 0 0; } }
                .brand-tag { font-size: 13px; color: #4a6741; text-decoration: none; font-family: 'Jost', sans-serif; letter-spacing: 0.3px; display: inline-block; margin-bottom: 10px; }
                .brand-tag:hover { text-decoration: underline; }
                .product-title { font-family: 'Playfair Display', serif; font-size: clamp(22px, 3vw, 34px); font-weight: 500; color: #1a2b15; line-height: 1.25; margin-bottom: 18px; }

                /* Price */
                .price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 6px; }
                .price-current { font-size: 22px; font-weight: 600; color: #1a2b15; font-family: 'Jost', sans-serif; }
                .price-original { font-size: 16px; color: #c03030; text-decoration: line-through; font-family: 'Jost', sans-serif; }
                .price-discount { font-size: 13px; background: #e8f5e8; color: #2a7a2a; padding: 2px 8px; border-radius: 20px; font-weight: 600; }
                .price-note { font-size: 12px; color: #888; margin-bottom: 24px; font-family: 'Jost', sans-serif; }
                .price-note a { color: #4a6741; }

                /* Specs */
                .specs-divider { border: none; border-top: 1px solid #eee; margin: 20px 0; }
                .spec-row { display: flex; gap: 8px; margin-bottom: 10px; font-size: 14px; font-family: 'Jost', sans-serif; }
                .spec-label { font-weight: 700; color: #1a2b15; min-width: 130px; }
                .spec-value { color: #555; line-height: 1.5; }

                /* Weight / Qty */
                .selector-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #4a5a40; margin-bottom: 8px; font-family: 'Jost', sans-serif; }
                .weight-select { width: 100%; padding: 11px 16px; border: 1px solid #d0d8c8; border-radius: 4px; font-family: 'Jost', sans-serif; font-size: 14px; color: #1a2b15; background: #fff; cursor: pointer; outline: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; margin-bottom: 20px; }
                .weight-select:focus { border-color: #4a6741; box-shadow: 0 0 0 3px rgba(74,103,65,0.1); }
                .qty-input { width: 72px; padding: 10px 14px; border: 1px solid #d0d8c8; border-radius: 4px; font-family: 'Jost', sans-serif; font-size: 15px; font-weight: 600; color: #1a2b15; text-align: center; outline: none; }
                .qty-input:focus { border-color: #4a6741; }

                /* Delivery timeline */
                .delivery-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; border: 1px solid #e0e8d8; border-radius: 8px; overflow: hidden; margin: 24px 0; }
                .delivery-cell { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 14px 8px; text-align: center; border-right: 1px solid #e0e8d8; background: #fafcf8; }
                .delivery-cell:last-child { border-right: none; }
                .delivery-icon { font-size: 20px; margin-bottom: 4px; }
                .delivery-stage { font-size: 11px; font-weight: 700; color: #4a6741; font-family: 'Jost', sans-serif; letter-spacing: 0.5px; text-transform: uppercase; }
                .delivery-date { font-size: 12px; color: #888; font-family: 'Jost', sans-serif; margin-top: 2px; }

                /* Buttons */
                .btn-addcart { width: 100%; padding: 15px; border: 2px solid #4a6741; background: transparent; color: #4a6741; font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; border-radius: 2px; margin-bottom: 12px; transition: all 0.25s ease; }
                .btn-addcart:hover { background: #4a6741; color: #fff; }
                .btn-addcart.added { background: #4a6741; color: #fff; }
                .btn-buynow { width: 100%; padding: 15px; border: none; background: #1a2b15; color: #fff; font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; border-radius: 2px; margin-bottom: 20px; transition: background 0.25s ease; }
                .btn-buynow:hover { background: #4a6741; }

                /* Share */
                .share-row { display: flex; align-items: center; gap: 12px; padding-top: 16px; border-top: 1px solid #eee; font-size: 13px; color: #888; font-family: 'Jost', sans-serif; }
                .share-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; border: 1px solid #e0e0e0; background: #fff; cursor: pointer; color: #555; transition: all 0.2s; text-decoration: none; }
                .share-btn:hover { border-color: #4a6741; color: #4a6741; }

                /* Features section */
                .features-section { background: #f5f2ec; padding: 64px 48px; margin-top: 64px; text-align: center; }
                .features-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 500; color: #1a2b15; margin-bottom: 48px; }
                .features-grid { display: flex; justify-content: center; gap: 80px; flex-wrap: wrap; }
                .feature-item { display: flex; flex-direction: column; align-items: center; gap: 14px; }
                .feature-icon-wrap { width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 36px; }
                .feature-caption { font-size: 13px; color: #4a6741; font-family: 'Jost', sans-serif; font-weight: 500; max-width: 120px; text-align: center; line-height: 1.4; }

                /* Grade badge pill */
                .grade-badge { display: inline-block; padding: 3px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; color: #fff; letter-spacing: 0.5px; font-family: 'Jost', sans-serif; margin-bottom: 12px; }

                /* Other grades strip */
                .other-grades { max-width: 1200px; margin: 48px auto 0; padding: 0 48px 64px; }
                .other-grades-title { font-family: 'Playfair Display', serif; font-size: 20px; color: '#1a2b15'; margin-bottom: 24px; }
                .other-grades-strip { display: flex; gap: 16px; flex-wrap: wrap; }
                .grade-chip { display: flex; align-items: center; gap: 10px; padding: 10px 18px; border: 1px solid #e0e8d8; border-radius: 40px; text-decoration: none; font-family: 'Jost', sans-serif; font-size: 13px; color: #1a2b15; transition: all 0.2s; background: #fff; }
                .grade-chip:hover { border-color: #4a6741; background: #f5f9f2; }
                .grade-chip img { width: 28px; height: 32px; object-fit: contain; }
                .grade-chip-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
            `}</style>

            <div className="col-page">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <div className="breadcrumb-left">
                        <Link href="/">Home</Link>
                        <span style={{ color: '#ccc' }}>›</span>
                        <Link href="/#grading">World's Best Cardamom</Link>
                        <span style={{ color: '#ccc' }}>›</span>
                        <span>{grade.name}</span>
                    </div>
                    <div className="breadcrumb-nav">
                        {prevSlug && (
                            <Link href={`/collection/${prevSlug}`}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                Previous
                            </Link>
                        )}
                        {nextSlug && (
                            <Link href={`/collection/${nextSlug}`}>
                                Next
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Product Layout */}
                <div className="product-layout">
                    {/* ─── Left: Gallery ─── */}
                    <div>
                        <div className="gallery-main">
                            <img src={grade.images[activeImg] || grade.images[0]} alt={grade.name} />
                            {/* Grade badge overlay */}
                            <div style={{
                                position: 'absolute', top: '16px', left: '16px',
                                background: grade.badgeColor, color: '#fff',
                                fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 700,
                                letterSpacing: '1px', padding: '5px 14px', borderRadius: '3px',
                            }}>
                                {grade.grade.toUpperCase()} GRADE
                            </div>
                        </div>
                        <div className="gallery-thumbs">
                            {grade.images.map((img, i) => (
                                <div key={i}
                                    className={`gallery-thumb${activeImg === i ? ' active' : ''}`}
                                    onClick={() => setActiveImg(i)}>
                                    <img src={img} alt={`${grade.name} view ${i + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ─── Right: Info ─── */}
                    <div className="product-info">
                        <span className="grade-badge" style={{ background: grade.badgeColor }}>
                            {grade.size}
                        </span>

                        <a href="#" className="brand-tag">By Emperor Akbar Cardamom</a>

                        <h1 className="product-title">{grade.name}</h1>

                        {/* Price */}
                        <div className="price-row">
                            <span className="price-current">Rs. {currentPrice.toLocaleString('en-IN')}</span>
                            <span className="price-original">Rs. {currentOriginalPrice.toLocaleString('en-IN')}</span>
                            <span className="price-discount">{discount}% off</span>
                        </div>
                        <p className="price-note">Incl. of all taxes. <a href="#">Shipping</a> calculated at checkout.</p>

                        <hr className="specs-divider" />

                        {/* Specs */}
                        <div className="spec-row"><span className="spec-label">Origin:</span><span className="spec-value">{grade.origin}</span></div>
                        <div className="spec-row"><span className="spec-label">Speciality:</span><span className="spec-value">{grade.speciality}</span></div>
                        <div className="spec-row"><span className="spec-label">Grade:</span><span className="spec-value">{grade.grade}</span></div>
                        <div className="spec-row"><span className="spec-label">Size:</span><span className="spec-value">{grade.size}</span></div>
                        <div className="spec-row"><span className="spec-label">Usage:</span><span className="spec-value">{grade.usage}</span></div>
                        <div className="spec-row"><span className="spec-label">Manufactured / Packed by:</span><span className="spec-value">{grade.manufacturer}</span></div>

                        <hr className="specs-divider" />

                        {/* Weight */}
                        <p className="selector-label">WEIGHT</p>
                        <select
                            className="weight-select"
                            value={selectedWeight}
                            onChange={e => setSelectedWeight(e.target.value)}
                        >
                            {(grade.weights || []).map(w => <option key={w.weight} value={w.weight}>{w.weight}</option>)}
                        </select>

                        {/* Qty */}
                        <p className="selector-label">QTY</p>
                        <input
                            type="number"
                            className="qty-input"
                            min={1}
                            max={99}
                            value={qty}
                            onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                            style={{ marginBottom: '20px' }}
                        />

                        {/* Delivery Timeline */}
                        <div className="delivery-grid">
                            <div className="delivery-cell">
                                <div className="delivery-icon">🛍️</div>
                                <div className="delivery-stage">Ordered</div>
                                <div className="delivery-date">{dates.ordered}</div>
                            </div>
                            <div className="delivery-cell">
                                <div className="delivery-icon">📦</div>
                                <div className="delivery-stage">Order Ready</div>
                                <div className="delivery-date">{dates.readyFrom} - {dates.readyTo}</div>
                            </div>
                            <div className="delivery-cell">
                                <div className="delivery-icon">📍</div>
                                <div className="delivery-stage">Delivered</div>
                                <div className="delivery-date">{dates.deliveredFrom} - {dates.deliveredTo}</div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <button
                            className={`btn-addcart${added ? ' added' : ''}`}
                            onClick={handleAddToCart}
                        >
                            {added ? '✓ Added to Cart' : 'ADD TO CART'}
                        </button>
                        <button className="btn-buynow" onClick={() => { handleAddToCart(); window.location.href = '/cart'; }}>
                            BUY IT NOW
                        </button>

                        {/* Share */}
                        <div className="share-row">
                            <span>Share</span>
                            <a href="#" className="share-btn" aria-label="Share on Facebook" title="Share on Facebook">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            </a>
                            <a href="#" className="share-btn" aria-label="Share on Twitter" title="Share on Twitter">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
                            </a>
                            <a href="#" className="share-btn" aria-label="Share on Pinterest" title="Share on Pinterest">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.24-5.26 1.24-5.26s-.32-.63-.32-1.57c0-1.47.85-2.57 1.91-2.57.9 0 1.33.67 1.33 1.48 0 .9-.58 2.26-.88 3.52-.25 1.05.52 1.9 1.55 1.9 1.86 0 3.11-2.39 3.11-5.22 0-2.15-1.45-3.75-4.08-3.75-2.97 0-4.8 2.22-4.8 4.7 0 .85.25 1.45.64 1.91.18.21.2.3.14.54l-.23.9c-.07.3-.28.4-.52.29-1.47-.6-2.16-2.22-2.16-4.04 0-2.99 2.52-6.58 7.53-6.58 4.02 0 6.66 2.92 6.66 6.05 0 4.15-2.3 7.25-5.69 7.25-1.14 0-2.21-.61-2.58-1.31l-.7 2.68c-.26.97-.93 2.18-1.39 2.92.66.2 1.36.31 2.08.31 5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* ─── Other Grades ─── */}
                <div className="other-grades">
                    <h2 className="other-grades-title" style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#1a2b15', marginBottom: '20px' }}>
                        Explore Other Grades
                    </h2>
                    <div className="other-grades-strip">
                        {allGrades.filter(g => g.slug !== slug).map(g => (
                            <Link key={g.slug} href={`/collection/${g.slug}`} className="grade-chip">
                                <img src={g.images[0]} alt={g.grade} />
                                <span className="grade-chip-dot" style={{ background: g.badgeColor }} />
                                <span>{g.grade} Grade <span style={{ color: '#888', fontWeight: 400 }}>· {g.size}</span></span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ─── Features ─── */}
                <div className="features-section">
                    <h2 className="features-title">Features</h2>
                    <div className="features-grid">
                        {grade.features.map((f, i) => (
                            <div key={i} className="feature-item">
                                <div className="feature-icon-wrap">{f.icon}</div>
                                <span className="feature-caption">{f.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
