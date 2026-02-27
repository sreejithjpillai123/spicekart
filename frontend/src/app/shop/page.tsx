'use client';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { getProducts, Product } from '../lib/api';
import { useCart } from '../context/CartContext';

const SORT_OPTIONS = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Name: A–Z', value: 'name_asc' },
];

export default function ShopPage() {
    const [sort, setSort] = useState('featured');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [addedId, setAddedId] = useState<string | null>(null);
    const { addToCart } = useCart();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProducts({ sort });
            setProducts(data);
        } catch {
            setError('Could not load products. Make sure the backend server is running.');
        } finally {
            setLoading(false);
        }
    }, [sort]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Scroll-reveal
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('shop-revealed'); observer.unobserve(e.target); }
            }),
            { threshold: 0.1 }
        );
        document.querySelectorAll('.shop-reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [products]);

    const handleAddToCart = (product: Product) => {
        if (product.badge === 'SOLD OUT') return;
        addToCart(product, 1);
        setAddedId(product._id);
        setTimeout(() => setAddedId(null), 1800);
    };

    return (
        <>
            <Navbar />

            {/* ─── Hero Banner ─── */}
            <section style={{
                position: 'relative',
                background: '#1e2218',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                overflow: 'hidden',
                paddingTop: '80px',
            }}>
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    backgroundImage: `repeating-linear-gradient(-55deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)`,
                }} />

                <svg style={{ position: 'absolute', left: 0, bottom: 0, height: '100%', zIndex: 1, opacity: 0.85 }} viewBox="0 0 220 300" fill="none">
                    <path d="M40 300 Q20 220 50 160 Q70 110 45 50" stroke="#4a7a30" strokeWidth="2" fill="none" />
                    <path d="M45 50 Q80 110 65 180 Q50 240 65 300" stroke="#4a7a30" strokeWidth="1.5" fill="rgba(50,80,30,0.4)" />
                    <path d="M10 280 Q30 220 60 170 Q90 130 130 110" stroke="#3a6a28" strokeWidth="1.5" fill="none" />
                    <path d="M130 110 Q95 140 65 190 Q40 240 25 290" stroke="#3a6a28" strokeWidth="1" fill="rgba(40,70,20,0.3)" />
                    <circle cx="128" cy="100" r="7" stroke="#c8a96e" strokeWidth="1.2" fill="none" />
                    <circle cx="128" cy="100" r="3" fill="#c8a96e" opacity="0.5" />
                </svg>

                <svg style={{ position: 'absolute', right: 0, bottom: 0, height: '100%', zIndex: 1, opacity: 0.85 }} viewBox="0 0 220 300" fill="none">
                    <path d="M180 300 Q200 220 170 160 Q150 110 175 50" stroke="#4a7a30" strokeWidth="2" fill="none" />
                    <path d="M175 50 Q140 110 155 180 Q170 240 155 300" stroke="#4a7a30" strokeWidth="1.5" fill="rgba(50,80,30,0.4)" />
                    <circle cx="95" cy="90" r="12" stroke="#e8e0d0" strokeWidth="1.2" fill="none" />
                    <circle cx="95" cy="90" r="5" fill="#e8e0d0" opacity="0.6" />
                    <ellipse cx="95" cy="73" rx="5" ry="9" stroke="#e8e0d0" strokeWidth="1" fill="rgba(232,224,208,0.25)" opacity="0.8" />
                    <ellipse cx="109" cy="99" rx="5" ry="9" transform="rotate(60 109 99)" stroke="#e8e0d0" strokeWidth="1" fill="rgba(232,224,208,0.25)" opacity="0.8" />
                    <ellipse cx="81" cy="99" rx="5" ry="9" transform="rotate(-60 81 99)" stroke="#e8e0d0" strokeWidth="1" fill="rgba(232,224,208,0.25)" opacity="0.8" />
                </svg>

                <h1 style={{
                    position: 'relative', zIndex: 3,
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'clamp(28px, 4vw, 52px)',
                    fontWeight: 500,
                    color: '#ffffff',
                    textAlign: 'center',
                    textShadow: '0 2px 20px rgba(0,0,0,0.7)',
                    marginBottom: '24px',
                    letterSpacing: '1px',
                }}>
                    World&apos;s Best Cardamom
                </h1>

                <div style={{
                    position: 'relative', zIndex: 3,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: '0px',
                    paddingBottom: '0',
                }}>
                    {[
                        { top: '#8b4fa8', bot: '#6a2e88' },
                        { top: '#c03070', bot: '#a01050' },
                        { top: '#3a7a28', bot: '#285a18' },
                        { top: '#d06010', bot: '#a04000' },
                        { top: '#b02020', bot: '#800000' },
                    ].map((c, i) => (
                        <div key={i} style={{
                            width: '80px',
                            height: `${150 + (i === 2 ? 20 : i === 1 || i === 3 ? 10 : 0)}px`,
                            marginLeft: i === 0 ? 0 : '-8px',
                            borderRadius: '6px 6px 0 0',
                            overflow: 'hidden',
                            boxShadow: '2px 0 12px rgba(0,0,0,0.4)',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: i === 2 ? 5 : 3,
                            transform: `translateY(${i === 2 ? 0 : i === 1 || i === 3 ? 10 : 20}px)`,
                        }}>
                            <div style={{ background: `linear-gradient(135deg, ${c.top}, ${c.bot})`, height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '7px', fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>SPICE</span>
                            </div>
                            <div style={{ flex: 1, background: 'linear-gradient(180deg, #f5f5f0, #e8e8e0)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6px', gap: '4px' }}>
                                <span style={{ fontSize: '18px' }}>🌿</span>
                                <div style={{ width: '60%', height: '2px', background: c.top, opacity: 0.5 }} />
                                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '5px', color: '#333', textAlign: 'center', lineHeight: 1.3 }}>NATURAL GREEN{'\n'}CARDAMOM</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Sort Bar ─── */}
            <div style={{
                background: '#ffffff',
                padding: '24px 60px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
            }}>
                <label htmlFor="shop-sort" style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', color: '#666', textTransform: 'uppercase' }}>
                    Sort By
                </label>
                <select
                    id="shop-sort"
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    style={{
                        fontFamily: 'Jost, sans-serif',
                        fontSize: '13px',
                        color: '#2c2c2c',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px 14px',
                        background: '#fff',
                        cursor: 'pointer',
                        outline: 'none',
                        minWidth: '180px',
                    }}
                >
                    {SORT_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
                {loading && <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#999' }}>Loading products…</span>}
                {!loading && !error && <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#999', marginLeft: 'auto' }}>{products.length} products</span>}
            </div>

            {/* ─── Products Grid ─── */}
            <section style={{ background: '#ffffff', padding: '48px 60px 80px' }}>

                {/* Error State */}
                {error && (
                    <div style={{
                        textAlign: 'center', padding: '60px 20px',
                        background: '#fff8f0', border: '1px solid #f0d0c0',
                        borderRadius: '8px', maxWidth: '500px', margin: '0 auto',
                    }}>
                        <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
                        <p style={{ fontFamily: 'Jost, sans-serif', color: '#b04020', marginBottom: '16px' }}>{error}</p>
                        <button
                            onClick={fetchProducts}
                            style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', background: '#4a6741', color: '#fff', border: 'none', padding: '12px 24px', cursor: 'pointer', borderRadius: '4px' }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Loading Skeletons */}
                {loading && !error && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
                                <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '4px', background: '#f0f0f0', marginBottom: '14px' }} />
                                <div style={{ height: '18px', background: '#f0f0f0', borderRadius: '3px', marginBottom: '8px', width: '80%' }} />
                                <div style={{ height: '14px', background: '#f5f5f5', borderRadius: '3px', width: '40%' }} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Products */}
                {!loading && !error && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '32px',
                        maxWidth: '1100px',
                        margin: '0 auto',
                    }}>
                        {products.map((p, i) => (
                            <div
                                key={p._id}
                                className="shop-reveal"
                                onMouseEnter={() => setHoveredId(p._id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    opacity: 0,
                                    transform: 'translateY(20px)',
                                    transition: `all 0.6s ease ${i * 0.08}s`,
                                    cursor: 'pointer',
                                }}
                            >
                                {/* Product Image Card */}
                                <div style={{
                                    position: 'relative',
                                    width: '100%',
                                    aspectRatio: '4/3',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    marginBottom: '14px',
                                    background: `linear-gradient(135deg, ${p.gradeColor}22, ${p.gradeAccent}44)`,
                                    border: '1px solid rgba(0,0,0,0.06)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    transform: hoveredId === p._id ? 'translateY(-4px)' : 'translateY(0)',
                                    boxShadow: hoveredId === p._id ? '0 12px 32px rgba(0,0,0,0.14)' : '0 2px 8px rgba(0,0,0,0.06)',
                                }}>
                                    {/* Badge */}
                                    {p.badge && (
                                        <div style={{
                                            position: 'absolute', top: '12px', left: '12px', zIndex: 2,
                                            background: p.badge === 'SOLD OUT' ? '#333' : '#4a6741',
                                            color: '#fff', fontFamily: 'Jost, sans-serif',
                                            fontSize: '10px', fontWeight: 700, letterSpacing: '1px',
                                            padding: '4px 10px', borderRadius: '2px',
                                        }}>
                                            {p.badge}
                                        </div>
                                    )}

                                    {/* Product visual */}
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                                        <div style={{
                                            width: '90px', height: '140px', borderRadius: '8px 8px 6px 6px',
                                            overflow: 'hidden', boxShadow: '4px 8px 20px rgba(0,0,0,0.25)',
                                            display: 'flex', flexDirection: 'column',
                                            transition: 'transform 0.3s ease',
                                            transform: hoveredId === p._id ? 'scale(1.04)' : 'scale(1)',
                                        }}>
                                            <div style={{ background: `linear-gradient(135deg,${p.gradeColor},${p.gradeColor}cc)`, height: '38px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                                                <span style={{ fontFamily: 'Jost,sans-serif', fontSize: '6px', fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>SPICE</span>
                                                <div style={{ width: '40px', height: '0.5px', background: 'rgba(255,255,255,0.5)' }} />
                                                <span style={{ fontFamily: 'Jost,sans-serif', fontSize: '5px', color: 'rgba(255,255,255,0.8)' }}>Alleppey · Kerala</span>
                                            </div>
                                            <div style={{ flex: 1, background: 'linear-gradient(180deg,#f8f8f3,#eeede5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '6px' }}>
                                                <span style={{ fontSize: '22px' }}>🌿</span>
                                                <span style={{ fontFamily: 'Jost,sans-serif', fontSize: '5.5px', fontWeight: 700, color: '#333', textAlign: 'center', lineHeight: 1.4 }}>NATURAL GREEN<br />CARDAMOM</span>
                                                <div style={{ background: p.gradeColor, color: '#fff', borderRadius: '2px', padding: '1px 6px', fontSize: '5px', fontFamily: 'Jost,sans-serif', fontWeight: 700, letterSpacing: '0.5px' }}>
                                                    100% NATURAL
                                                </div>
                                            </div>
                                        </div>
                                        {p.category !== 'Gift Cards' && (
                                            <div style={{
                                                width: '70px', height: '50px',
                                                borderRadius: '50% 50% 45% 45% / 30% 30% 60% 60%',
                                                background: `linear-gradient(180deg, ${p.gradeAccent}88, ${p.gradeColor}44)`,
                                                border: `2px solid ${p.gradeColor}66`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '18px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            }}>
                                                🌿
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: `radial-gradient(circle, ${p.gradeAccent}66 0%, transparent 70%)`, pointerEvents: 'none' }} />
                                </div>

                                {/* Product Info */}
                                <div>
                                    <h3 style={{
                                        fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontWeight: 600,
                                        color: p.badge === 'SOLD OUT' ? '#888' : '#1a4a10',
                                        marginBottom: '6px', lineHeight: 1.3,
                                    }}>
                                        {p.name}
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                        <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 500, color: '#2c2c2c' }}>
                                            From Rs. {p.price.toLocaleString('en-IN')}.00
                                        </span>
                                        {p.originalPrice && (
                                            <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#c03030', textDecoration: 'line-through' }}>
                                                Rs. {p.originalPrice.toLocaleString('en-IN')}.00
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(p)}
                                        disabled={p.badge === 'SOLD OUT'}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            fontFamily: 'Jost, sans-serif',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            letterSpacing: '1.5px',
                                            textTransform: 'uppercase',
                                            background: p.badge === 'SOLD OUT' ? '#ccc' : addedId === p._id ? '#2ea043' : '#4a6741',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '3px',
                                            cursor: p.badge === 'SOLD OUT' ? 'not-allowed' : 'pointer',
                                            transition: 'background 0.3s ease',
                                        }}
                                    >
                                        {p.badge === 'SOLD OUT' ? 'Sold Out' : addedId === p._id ? '✓ Added!' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ─── Subscribe Section ─── */}
            <section style={{
                background: '#faf8f4',
                padding: '72px 40px',
                textAlign: 'center',
                borderTop: '1px solid rgba(0,0,0,0.06)',
            }}>
                <svg width="36" height="28" viewBox="0 0 36 28" fill="none" style={{ marginBottom: '18px' }}>
                    <rect x="1" y="1" width="34" height="26" rx="2" stroke="#4a6741" strokeWidth="1.5" />
                    <path d="M1 4L18 16L35 4" stroke="#4a6741" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: 500, color: '#4a6741', marginBottom: '28px' }}>
                    Subscribe for new offers
                </h3>
                <div style={{ display: 'flex', maxWidth: '460px', margin: '0 auto', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                    <input
                        type="email"
                        placeholder="Email address"
                        id="shop-email"
                        style={{ flex: 1, fontFamily: 'Jost, sans-serif', fontSize: '13px', padding: '14px 18px', border: '1px solid #d8d0c0', borderRight: 'none', outline: 'none', background: '#fff', color: '#2c2c2c' }}
                    />
                    <button
                        id="shop-subscribe-btn"
                        style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', background: '#4a6741', color: '#fff', border: 'none', padding: '14px 24px', cursor: 'pointer' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#3a5531'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#4a6741'; }}
                        onClick={async () => {
                            const input = document.getElementById('shop-email') as HTMLInputElement;
                            const btn = document.getElementById('shop-subscribe-btn') as HTMLButtonElement;
                            if (!input?.value) return;
                            btn.textContent = '…';
                            btn.disabled = true;
                            try {
                                const { subscribeNewsletter } = await import('../lib/api');
                                const res = await subscribeNewsletter(input.value);
                                btn.textContent = '✓';
                                input.value = '';
                                setTimeout(() => { btn.textContent = 'Subscribe'; btn.disabled = false; }, 2500);
                                alert(res.message);
                            } catch (err: unknown) {
                                btn.textContent = 'Subscribe';
                                btn.disabled = false;
                                alert(err instanceof Error ? err.message : 'Already subscribed or invalid email');
                            }
                        }}
                    >
                        Subscribe
                    </button>
                </div>
            </section>

            <style>{`
                .shop-reveal.shop-revealed {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </>
    );
}
