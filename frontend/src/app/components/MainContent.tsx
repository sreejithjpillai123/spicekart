'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { getProducts, subscribeNewsletter, type Product } from '../lib/api';
import { useCart } from '../context/CartContext';

// Static home page showcase products (fallback + featured)
const staticProducts = [
    { emoji: <img src="https://e7.pngegg.com/pngimages/118/390/png-clipart-green-vegetable-lot-true-cardamom-indian-cuisine-black-cardamom-spice-spice-food-superfood.png" alt="" />, category: 'Cardamom', name: 'Alleppey Green Cardamom', desc: 'Premium grade, hand-picked from the hills of Kerala. Intensely aromatic.', price: '₹899', tag: 'Best Seller', id: 'product-cardamom' },
    { emoji: <img src="https://th.bing.com/th/id/OIP.vQMtSfxkKuhqpq_akJUuzQAAAA?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" alt="" />, category: 'Pepper', name: 'Malabar Black Pepper', desc: 'Bold, robust piperine-rich pepper from the legendary Malabar coast.', price: '₹499', tag: 'New', id: 'product-pepper' },
    { emoji: <img src="https://th.bing.com/th/id/OIP.qnyM1obakgu-I7HZ-1Tk6gHaE8?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" alt="" />, category: 'Pepper Powder', name: 'White Pepper Whole', desc: 'Delicate and earthy, perfect for light-coloured dishes and sauces.', price: '₹549', tag: null, id: 'product-white-pepper' },
];

const features = [
    { icon: '🌾', title: '100% Natural', desc: 'No artificial preservatives, colours, or additives. Pure spices as nature intended them.' },
    { icon: '🏔️', title: 'Single-Origin', desc: 'Traced directly from our partner farms in the Western Ghats and Malabar region.' },
    { icon: '🏆', title: 'Award Winning', desc: 'Recipient of multiple international quality certifications and gourmet food awards.' },
];

const testimonials = [
    { quote: 'The cardamom is incredibly fragrant — I can taste the difference in every cup of chai. Truly the best I\'ve ever had.', author: 'Priya Nair', location: 'Kochi, Kerala', emoji: '👩', stars: 5 },
    { quote: 'As a professional chef, the quality of spices matters enormously. Spice delivers consistently exceptional products.', author: 'Chef Arjun Menon', location: 'Mumbai, MH', emoji: '👨‍🍳', stars: 5 },
    { quote: 'Finally, a brand that understands sustainability and flavour in equal measure. These spices have transformed my cooking.', author: 'Ananya Sharma', location: 'Bengaluru, KA', emoji: '👩‍🍳', stars: 5 },
];

function useScrollReveal() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.12 });

        const el = ref.current;
        if (!el) return;
        const targets = el.querySelectorAll('.fade-in-up');
        targets.forEach(t => observer.observe(t));
        return () => observer.disconnect();
    }, []);
    return ref;
}

// ─── Rotating Heading for Quality Section ───
const rotatingLines = [
    'The world\'s finest cardamom is handpicked from the lush green plantations of South India, and then graded and packed for you.',
    'From farm to pack in 24 hours — our cardamom retains 100% of its natural aroma, oil, and freshness.',
    'Trusted by spice traders and food manufacturers across 30+ countries. Bulk supply, uncompromised quality.',
    'Every pod is sorted by size, tested for purity, and sealed with our signature Aroma Lock technology.',
];

function RotatingHeading() {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            // Fade out
            setVisible(false);
            setTimeout(() => {
                // Swap text, then fade back in
                setIndex(prev => (prev + 1) % rotatingLines.length);
                setVisible(true);
            }, 600); // match transition duration
        }, 4500); // show each for 4.5s
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            minHeight: '140px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
        }}>
            <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(22px, 3vw, 40px)',
                fontWeight: 500,
                color: '#2c2c2c',
                lineHeight: 1.5,
                maxWidth: '720px',
                margin: '0 auto 40px',
                textAlign: 'center',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0px)' : 'translateY(10px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}>
                {rotatingLines[index]}
            </h2>
        </div>
    );
}

export default function MainContent() {
    const contentRef = useScrollReveal();
    const { addToCart } = useCart();
    const [liveProducts, setLiveProducts] = useState<Product[]>([]);
    const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
    const [subMsg, setSubMsg] = useState('');

    useEffect(() => {
        getProducts({ sort: 'featured' })
            .then(data => setLiveProducts(data.slice(0, 3)))
            .catch(() => { /* silently fall back to static products */ });
    }, []);

    const handleNewsletterSubmit = async () => {
        const input = document.getElementById('newsletter-email') as HTMLInputElement;
        if (!input?.value) return;
        setSubStatus('loading');
        try {
            const res = await subscribeNewsletter(input.value);
            setSubMsg(res.message);
            setSubStatus('done');
            input.value = '';
        } catch (err: unknown) {
            setSubMsg(err instanceof Error ? err.message : 'Could not subscribe.');
            setSubStatus('error');
        }
    };

    return (
        <div ref={contentRef}>
            {/* ─── About / Bulk Supply ─── */}
            <section id="about" className="about-section">
                <div className="fade-in-up">
                    <p className="section-eyebrow">Wholesale &amp; Bulk Supply</p>
                </div>
                <div className="fade-in-up fade-in-up-delay-1">
                    <h2 className="section-title">Premium Cardamom,<br />Supplied at Scale</h2>
                </div>
                <div className="fade-in-up fade-in-up-delay-2">
                    <p className="section-body">
                        We supply top-grade Idukki Green Cardamom in bulk and large quantities directly from
                        the source — ideal for spice traders, exporters, food manufacturers, and hospitality
                        chains. Whether you need a 50 kg consignment or a full container load, we guarantee
                        consistent quality, competitive pricing, and reliable timelines, every single time.
                    </p>
                </div>
                <div className="fade-in-up fade-in-up-delay-3">
                    <a href="#shop" className="facts-link" id="facts-link">ENQUIRE ABOUT BULK ORDERS</a>
                </div>
            </section>


            {/* ─── Feature Cards ─── */}
            <section id="csr" className="features-section">
                <div className="features-header">
                    <div className="fade-in-up">
                        <p className="section-eyebrow" style={{ color: 'rgba(200,169,110,0.8)' }}>Why Choose Us</p>
                    </div>
                    <div className="fade-in-up fade-in-up-delay-1">
                        <h2 className="section-title">The Spice Difference</h2>
                    </div>
                </div>
                <div className="features-grid">
                    {features.map((f, i) => (
                        <div key={f.title} className={`feature-card fade-in-up fade-in-up-delay-${i + 1}`} id={`feature-${i}`}>
                            <div className="feature-icon">{f.icon}</div>
                            <h3 className="feature-title">{f.title}</h3>
                            <p className="feature-desc">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Cinematic Video Banner ─── */}
            <section id="video-banner" style={{
                position: 'relative',
                width: '100%',
                height: '480px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {/* Real video background */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        zIndex: 0,
                    }}
                >
                    <source src="/videos/cardamom.mp4" type="video/mp4" />
                </video>

                {/* Dark overlay gradient */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(10,12,8,0.45) 0%, rgba(10,12,8,0.35) 50%, rgba(10,12,8,0.6) 100%)',
                    zIndex: 3,
                }} />


                {/* Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 4,
                    textAlign: 'center',
                    padding: '0 40px',
                    maxWidth: '700px',
                }}>
                    <p style={{
                        fontFamily: 'Jost, sans-serif',
                        fontSize: '11px',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        color: 'rgba(200,169,110,0.85)',
                        marginBottom: '18px',
                        animation: 'fadeUpIn 1s ease 0.2s both',
                    }}>
                        Kerala · India
                    </p>
                    <h2 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(30px, 4.5vw, 54px)',
                        fontWeight: 500,
                        color: '#ffffff',
                        lineHeight: 1.2,
                        marginBottom: '18px',
                        textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                        animation: 'fadeUpIn 1s ease 0.4s both',
                    }}>
                        The World&apos;s Best Cardamom
                    </h2>
                    <p style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '18px',
                        color: 'rgba(255,255,255,0.75)',
                        lineHeight: 1.7,
                        marginBottom: '36px',
                        textShadow: '0 1px 8px rgba(0,0,0,0.4)',
                        animation: 'fadeUpIn 1s ease 0.6s both',
                    }}>
                        A treasure trove of aroma, flavour and health.
                    </p>
                    <div style={{ animation: 'fadeUpIn 1s ease 0.8s both' }}>
                        <a
                            href="#about"
                            id="video-banner-read-more"
                            style={{
                                display: 'inline-block',
                                fontFamily: 'Jost, sans-serif',
                                fontSize: '11px',
                                fontWeight: 600,
                                letterSpacing: '3px',
                                textTransform: 'uppercase',
                                color: '#ffffff',
                                border: '1px solid rgba(255,255,255,0.6)',
                                padding: '14px 40px',
                                textDecoration: 'none',
                                transition: 'all 0.35s ease',
                                backdropFilter: 'blur(4px)',
                                background: 'rgba(255,255,255,0.06)',
                            }}
                            onMouseEnter={e => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.background = 'rgba(200,169,110,0.85)';
                                el.style.borderColor = 'transparent';
                                el.style.color = '#fff';
                                el.style.letterSpacing = '4px';
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.background = 'rgba(255,255,255,0.06)';
                                el.style.borderColor = 'rgba(255,255,255,0.6)';
                                el.style.color = '#fff';
                                el.style.letterSpacing = '3px';
                            }}
                        >
                            Read More
                        </a>
                    </div>
                </div>

                {/* Bottom vignette */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '80px',
                    background: 'linear-gradient(to bottom, transparent, rgba(245,240,232,0.15))',
                    zIndex: 5,
                    pointerEvents: 'none',
                }} />
            </section>

            {/* ─── Products ─── */}
            <section id="shop" className="products-section">
                <div className="products-header">
                    <div className="fade-in-up">
                        <p className="section-eyebrow">Our Collection</p>
                    </div>
                    <div className="fade-in-up fade-in-up-delay-1">
                        <h2 className="section-title">Premium Spice Range</h2>
                    </div>
                    <div className="fade-in-up fade-in-up-delay-2">
                        <p className="section-body" style={{ marginTop: '14px' }}>
                            Handpicked, sun-dried and carefully packaged to preserve every note of flavour and aroma.
                        </p>
                    </div>
                </div>

                <div className="products-grid">
                    {(liveProducts.length > 0 ? liveProducts.map((p, i) => (
                        <div key={p._id} className={`product-card fade-in-up fade-in-up-delay-${i + 1}`} id={`product-live-${i}`}>
                            <div className="product-img-wrap">
                                {p.badge && <span className="product-tag">{p.badge}</span>}
                                <span className="product-img-emoji" style={{ fontSize: '48px' }}>🌿</span>
                            </div>
                            <div className="product-info">
                                <span className="product-category">{p.category}</span>
                                <h3 className="product-name">{p.name}</h3>
                                <p className="product-desc">{p.description}</p>
                                <div className="product-footer">
                                    <span className="product-price">₹{p.price.toLocaleString('en-IN')}</span>
                                    <button
                                        className="add-to-cart"
                                        aria-label={`Add ${p.name} to cart`}
                                        onClick={() => addToCart(p, 1)}
                                        disabled={p.badge === 'SOLD OUT'}
                                        style={{ opacity: p.badge === 'SOLD OUT' ? 0.5 : 1, cursor: p.badge === 'SOLD OUT' ? 'not-allowed' : 'pointer' }}
                                    >
                                        {p.badge === 'SOLD OUT' ? 'Sold Out' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : staticProducts.map((p, i) => (
                        <div key={p.id} className={`product-card fade-in-up fade-in-up-delay-${i + 1}`} id={p.id}>
                            <div className="product-img-wrap">
                                {p.tag && <span className="product-tag">{p.tag}</span>}
                                <span className="product-img-emoji">{p.emoji}</span>
                            </div>
                            <div className="product-info">
                                <span className="product-category">{p.category}</span>
                                <h3 className="product-name">{p.name}</h3>
                                <p className="product-desc">{p.desc}</p>
                                <div className="product-footer">
                                    <span className="product-price">{p.price}</span>
                                    <button className="add-to-cart" aria-label={`Add ${p.name} to cart`}>Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    )))}
                </div>

                <div className="products-cta fade-in-up">
                    <a href="#shop" className="btn-primary" id="view-all-btn" style={{ clipPath: 'none', borderRadius: '2px' }}>View All Products</a>
                </div>
            </section>

            {/* ─── Quality Promise (World's Best Cardamom) ─── */}
            <section id="recipes" style={{
                background: '#faf8f4',
                padding: '90px 80px 80px',
                textAlign: 'center',
            }}>
                {/* Eyebrow */}
                <div className="fade-in-up">
                    <p style={{
                        fontFamily: 'Jost, sans-serif',
                        fontSize: '11px',
                        fontWeight: 500,
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        color: '#b8a070',
                        marginBottom: '28px',
                    }}>
                        What Makes Us World&apos;s Best Cardamom
                    </p>
                </div>

                {/* Rotating Main Heading */}
                <RotatingHeading />

                {/* Three Badge Icons */}
                <div className="fade-in-up fade-in-up-delay-2" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: '60px',
                    flexWrap: 'wrap',
                    marginBottom: '64px',
                }}>
                    {/* Badge 1 — Freshness Sealed / Aroma Lock Pack */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="46" stroke="#c8a96e" strokeWidth="1.2" strokeDasharray="4 3" />
                            <circle cx="50" cy="50" r="38" stroke="#c8a96e" strokeWidth="0.8" opacity="0.5" />
                            {/* Lock icon */}
                            <rect x="35" y="48" width="30" height="22" rx="3" stroke="#c8a96e" strokeWidth="1.5" fill="none" />
                            <path d="M38 48V40a12 12 0 0 1 24 0v8" stroke="#c8a96e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                            <circle cx="50" cy="59" r="3" fill="#c8a96e" />
                            <line x1="50" y1="62" x2="50" y2="66" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round" />
                            {/* Text arc top */}
                            <text fontFamily="Jost, sans-serif" fontSize="6.5" fontWeight="600" letterSpacing="2" fill="#c8a96e" textAnchor="middle">
                                <textPath href="#topArc" startOffset="50%">SPECIAL</textPath>
                            </text>
                            <text fontFamily="Jost, sans-serif" fontSize="7.5" fontWeight="700" letterSpacing="1.5" fill="#c8a96e" x="50" y="88" textAnchor="middle">LOCK PACK</text>
                            <text fontFamily="Jost, sans-serif" fontSize="8" fontWeight="600" letterSpacing="1" fill="#c8a96e" x="50" y="78" textAnchor="middle">AR🔒MA</text>
                            <defs>
                                <path id="topArc" d="M 15 50 A 35 35 0 0 1 85 50" />
                            </defs>
                        </svg>
                        <span style={{
                            fontFamily: 'Jost, sans-serif',
                            fontSize: '12px',
                            letterSpacing: '1px',
                            color: '#8a8a8a',
                        }}>Freshness Sealed</span>
                    </div>

                    {/* Badge 2 — 100% Natural */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="46" stroke="#c8a96e" strokeWidth="1.5" />
                            <circle cx="50" cy="50" r="38" stroke="#c8a96e" strokeWidth="0.7" opacity="0.5" />
                            {/* Leaf / plant icon */}
                            <path d="M50 68 C50 68 35 58 35 44 C35 35 42 28 50 28 C58 28 65 35 65 44 C65 58 50 68 50 68Z" stroke="#c8a96e" strokeWidth="1.4" fill="none" />
                            <path d="M50 28 C50 28 50 50 50 68" stroke="#c8a96e" strokeWidth="1" strokeDasharray="2 2" />
                            <path d="M50 44 C50 44 42 36 35 38" stroke="#c8a96e" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                            <path d="M50 50 C50 50 58 42 65 44" stroke="#c8a96e" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                            {/* Text */}
                            <text fontFamily="Jost, sans-serif" fontSize="9" fontWeight="800" letterSpacing="1" fill="#c8a96e" x="50" y="20" textAnchor="middle">100%</text>
                            <text fontFamily="Jost, sans-serif" fontSize="7.5" fontWeight="600" letterSpacing="1.5" fill="#c8a96e" x="50" y="83" textAnchor="middle">NATURAL</text>
                            {/* Stars */}
                            <text fontSize="7" fill="#c8a96e" x="50" y="92" textAnchor="middle">★ ★ ★</text>
                        </svg>
                        <span style={{
                            fontFamily: 'Jost, sans-serif',
                            fontSize: '12px',
                            letterSpacing: '1px',
                            color: '#2c2c2c',
                            fontWeight: 700,
                        }}>100% Natural</span>
                    </div>

                    {/* Badge 3 — Premium Quality */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="46" stroke="#c8a96e" strokeWidth="1.2" strokeDasharray="3 4" />
                            <circle cx="50" cy="50" r="38" stroke="#c8a96e" strokeWidth="0.8" opacity="0.5" />
                            {/* Crown icon */}
                            <path d="M28 62 L32 44 L42 54 L50 36 L58 54 L68 44 L72 62 Z" stroke="#c8a96e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                            <rect x="28" y="62" width="44" height="5" rx="1" stroke="#c8a96e" strokeWidth="1.2" fill="none" />
                            {/* Crown dots */}
                            <circle cx="32" cy="44" r="2" fill="#c8a96e" />
                            <circle cx="50" cy="36" r="2.5" fill="#c8a96e" />
                            <circle cx="68" cy="44" r="2" fill="#c8a96e" />
                            {/* Text */}
                            <text fontFamily="Jost, sans-serif" fontSize="7" fontWeight="700" letterSpacing="2" fill="#c8a96e" x="50" y="82" textAnchor="middle">QUALITY</text>
                            {/* Stars */}
                            <text fontSize="6.5" fill="#c8a96e" x="50" y="91" textAnchor="middle">★ ★ ★ ★ ★</text>
                        </svg>
                        <span style={{
                            fontFamily: 'Jost, sans-serif',
                            fontSize: '12px',
                            letterSpacing: '1px',
                            color: '#8a8a8a',
                        }}>Premium Quality</span>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="fade-in-up fade-in-up-delay-3">
                    <a
                        href="#shop"
                        id="quality-cta-btn"
                        style={{
                            display: 'inline-block',
                            fontFamily: 'Jost, sans-serif',
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '2.5px',
                            textTransform: 'uppercase',
                            color: '#4a6741',
                            border: '1px solid #4a6741',
                            padding: '15px 40px',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={e => {
                            const el = e.currentTarget as HTMLAnchorElement;
                            el.style.background = '#4a6741';
                            el.style.color = '#fff';
                        }}
                        onMouseLeave={e => {
                            const el = e.currentTarget as HTMLAnchorElement;
                            el.style.background = 'transparent';
                            el.style.color = '#4a6741';
                        }}
                    >
                        Our Best Kept Secret
                    </a>
                </div>
            </section>



            {/* ─── Testimonials ─── */}
            <section id="blogs" className="testimonials-section">
                <div className="fade-in-up">
                    <p className="section-eyebrow">Customer Stories</p>
                </div>
                <div className="fade-in-up fade-in-up-delay-1">
                    <h2 className="section-title">Loved by Spice Enthusiasts</h2>
                </div>
                <div className="testimonials-grid">
                    {testimonials.map((t, i) => (
                        <div key={i} className={`testimonial-card fade-in-up fade-in-up-delay-${i + 1}`} id={`testimonial-${i}`}>
                            <div className="star-rating">{'★'.repeat(t.stars)}</div>
                            <div className="testimonial-quote">&ldquo;</div>
                            <p className="testimonial-text">{t.quote}</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">{t.emoji}</div>
                                <div>
                                    <div className="author-name">{t.author}</div>
                                    <div className="author-loc">{t.location}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Graded to your Requirement ─── */}
            <section id="grading" style={{
                background: '#ffffff',
                padding: '90px 80px',
                textAlign: 'center',
            }}>
                <div className="fade-in-up">
                    <h2 className="section-title" style={{ color: '#4a6741', marginBottom: '24px' }}>
                        Graded to your Requirement
                    </h2>
                </div>
                <div className="fade-in-up fade-in-up-delay-1">
                    <p className="section-body" style={{ maxWidth: '680px', margin: '0 auto 56px' }}>
                        &apos;One size doesn&apos;t fit all&apos; is true in the case of cardamom as well. Because of their
                        multiple uses and benefits, cardamom pods of different sizes are used in different
                        applications. That is why our Cardamom is graded by size. However, the
                        grading is never about quality. Whatever the size, quality remains world class.
                    </p>
                </div>

                {/* Grade pods */}
                <div className="fade-in-up fade-in-up-delay-2" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    gap: '36px',
                    flexWrap: 'wrap',
                    marginBottom: '56px',
                }}>
                    {[
                        { bg: '#f3e8fa', scale: 1.15, image: 'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-13.png?v=1625571964' },
                        { bg: '#fce8f0', scale: 1.08, image: 'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-14.png?v=1625572139' },
                        { bg: '#e8f5ea', scale: 1.0, image: 'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-15.png?v=1625572139' },
                        { bg: '#fdf0e6', scale: 0.92, image: 'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-16.png?v=1625572139' },
                        { bg: '#fdeaea', scale: 0.85, image: 'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-17.png?v=1625572139' },
                    ].map((grade, i) => (
                        <div key={i} id={`grade-${i}`} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'transform 0.3s ease',
                            cursor: 'default',
                        }}>
                            {/* Cardamom Pod — image or SVG */}
                            <div style={{
                                transform: `scale(${grade.scale})`,
                                transformOrigin: 'bottom center',
                                marginBottom: `${(grade.scale - 0.85) * 20}px`,
                            }}>
                                {'image' in grade && grade.image ? (
                                    <img
                                        src={grade.image}
                                        alt="Cardamom grade"
                                        style={{
                                            width: '80px',
                                            height: '96px',
                                            objectFit: 'contain',
                                            display: 'block',
                                            filter: 'drop-shadow(0 4px 12px rgba(123,63,160,0.25))',
                                        }}
                                    />
                                ) : (
                                    <svg width="60" height="96" viewBox="0 0 60 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Pod body */}
                                        <ellipse cx="30" cy="54" rx="22" ry="36" fill="#4a8a3a" />
                                        {/* Highlight */}
                                        <ellipse cx="22" cy="38" rx="7" ry="14" fill="#6aaa5a" opacity="0.55" />
                                        {/* Ridge lines */}
                                        <line x1="30" y1="18" x2="30" y2="88" stroke="#2d6a28" strokeWidth="1.2" opacity="0.6" />
                                        <line x1="20" y1="22" x2="18" y2="84" stroke="#2d6a28" strokeWidth="0.8" opacity="0.4" />
                                        <line x1="40" y1="22" x2="42" y2="84" stroke="#2d6a28" strokeWidth="0.8" opacity="0.4" />
                                        {/* Tip */}
                                        <ellipse cx="30" cy="18" rx="5" ry="6" fill="#3a7a2e" />
                                        {/* Stem */}
                                        <line x1="30" y1="12" x2="30" y2="2" stroke="#5a8a3a" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="fade-in-up fade-in-up-delay-3">
                    <a
                        href="#shop"
                        id="grading-cta-btn"
                        style={{
                            display: 'inline-block',
                            fontFamily: 'Jost, sans-serif',
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '2.5px',
                            textTransform: 'uppercase',
                            color: '#4a6741',
                            border: '1px solid #4a6741',
                            padding: '15px 36px',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLAnchorElement).style.background = '#4a6741';
                            (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                            (e.currentTarget as HTMLAnchorElement).style.color = '#4a6741';
                        }}
                    >
                        Setting Standards for Others to Follow
                    </a>
                </div>
            </section>

            {/* ─── Footer ─── */}
            <footer id="faqs" className="footer" role="contentinfo">
                <div className="footer-top">
                    {/* Brand col */}
                    <div className="footer-brand">
                        {/* Logo image */}
                        <div style={{ marginBottom: '16px' }}>
                            <Image
                                src="/images/logo.png"
                                alt="Spice Logo"
                                width={110}
                                height={110}
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>
                        <p>Bringing the world&apos;s finest spices from the lush highlands of Kerala to your kitchen since 1998.</p>
                        <div className="footer-socials">
                            {['f', 'in', 'ig', 'yt'].map((s, i) => (
                                <a key={i} href="#" className="social-link" aria-label={['Facebook', 'LinkedIn', 'Instagram', 'YouTube'][i]}>
                                    {['fb', 'in', 'ig', 'yt'][i].slice(0, 1).toUpperCase()}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="footer-col-title">Quick Links</h4>
                        <ul className="footer-links">
                            {['About Us', 'Shop', 'Recipes', 'Blogs', 'CSR Initiatives', 'Contact'].map(l => (
                                <li key={l}><a href="#">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="footer-col-title">Products</h4>
                        <ul className="footer-links">
                            {['Green Cardamom', 'Black Pepper', 'White Pepper', 'Vanilla Pods', 'Turmeric', 'Cloves'].map(l => (
                                <li key={l}><a href="#">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="footer-col-title">Stay in Touch</h4>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: '18px', fontFamily: 'Jost, sans-serif' }}>
                            Subscribe for recipes, spice tips and exclusive offers delivered to your inbox.
                        </p>
                        <div className="newsletter-form">
                            <input
                                type="email"
                                className="newsletter-input"
                                placeholder="your@email.com"
                                aria-label="Email for newsletter"
                                id="newsletter-email"
                                onKeyDown={e => e.key === 'Enter' && handleNewsletterSubmit()}
                            />
                            <button
                                className="newsletter-btn"
                                aria-label="Subscribe"
                                id="newsletter-btn"
                                onClick={handleNewsletterSubmit}
                                disabled={subStatus === 'loading' || subStatus === 'done'}
                            >
                                {subStatus === 'loading' ? '…' : subStatus === 'done' ? '✓' : '→'}
                            </button>
                        </div>
                        {subMsg && (
                            <p style={{ marginTop: '10px', fontSize: '12px', fontFamily: 'Jost, sans-serif', color: subStatus === 'error' ? '#c03030' : '#4a6741' }}>
                                {subMsg}
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer bottom */}
                <div className="footer-bottom">
                    <span className="footer-copy">© 2026 Spice. All rights reserved. Made with ❤️ in Kerala.</span>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Use</a>
                        <a href="#">Shipping Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
