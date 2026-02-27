'use client';
import { useEffect, useRef, useState } from 'react';

const slides = [
    {
        tagline: 'Premium Kerala Spices',
        title: 'Explore the Magic',
        titleHighlight: 'of Cardamom',
        subtitle: 'From the lush green hills of Idukki  , Kerala — experience the world\'s finest cardamom, handpicked with a century of tradition.',
        productEmoji: '📦',
        bgColor: 'linear-gradient(135deg, #1a1e1a 0%, #1e2a1e 30%, #151c22 60%, #0f1318 100%)',
    },
    {
        tagline: 'Aromatic Excellence',
        title: 'Nature\'s Finest',
        titleHighlight: 'Black Pepper',
        subtitle: 'Rich, bold, and full of character. Our black pepper is sourced from the Malabar coast, aged to perfection.',
        productEmoji: '🫙',
        bgColor: 'linear-gradient(135deg, #1a0f0a 0%, #2a1a0e 30%, #1a1010 60%, #100a08 100%)',
    },
    {
        tagline: 'Culinary Heritage',
        title: 'Discover the World',
        titleHighlight: 'of Cardamom',
        subtitle: 'Pure, unadulterated cardamom from Kerala\'s verdant estates. The secret ingredient of every great dessert.',
        productEmoji: '🌿',
        bgColor: 'linear-gradient(135deg, #1a150a 0%, #2a2010 30%, #1a1a08 60%, #100f04 100%)',
    },
];

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const goToSlide = (idx: number) => {
        setCurrentSlide((idx + slides.length) % slides.length);
    };

    useEffect(() => {
        timerRef.current = setTimeout(() => goToSlide(currentSlide + 1), 6000);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [currentSlide]);

    const slide = slides[currentSlide];

    return (
        <section id="hero" className="hero-section" style={{ background: slide.bgColor, transition: 'background 1s ease' }}>
            {/* Background */}
            <div className="hero-bg" />

            {/* Botanical Decorations (SVG leaves) */}
            <div className="botanicals">

                <svg className="botanical-left" viewBox="0 0 300 700" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M60 700 Q-40 550 80 400 Q160 300 60 150 Q40 80 100 0" stroke="#2d5a2d" strokeWidth="3" fill="none" opacity="0.6" />
                    <path d="M80 500 Q-60 420 20 300 Q80 220 40 120" stroke="#3d6b3d" strokeWidth="2" fill="none" opacity="0.5" />

                    <ellipse cx="100" cy="420" rx="90" ry="30" fill="#2d5a2d" opacity="0.55" transform="rotate(-35 100 420)" />
                    <ellipse cx="55" cy="320" rx="75" ry="22" fill="#3a6e3a" opacity="0.5" transform="rotate(-20 55 320)" />
                    <ellipse cx="130" cy="250" rx="80" ry="25" fill="#264d26" opacity="0.45" transform="rotate(-50 130 250)" />
                    <ellipse cx="30" cy="180" rx="65" ry="18" fill="#4a7a4a" opacity="0.4" transform="rotate(-15 30 180)" />
                    <ellipse cx="110" cy="560" rx="100" ry="32" fill="#1e4a1e" opacity="0.6" transform="rotate(-40 110 560)" />
                    <ellipse cx="20" cy="480" rx="70" ry="20" fill="#355a35" opacity="0.45" transform="rotate(-25 20 480)" />
                </svg>

                <svg className="botanical-right" viewBox="0 0 300 650" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M240 650 Q340 500 220 370 Q140 270 240 130 Q260 60 200 0" stroke="#2d5a2d" strokeWidth="3" fill="none" opacity="0.6" />
                    <ellipse cx="195" cy="400" rx="90" ry="30" fill="#2d5a2d" opacity="0.55" transform="rotate(35 195 400)" />
                    <ellipse cx="240" cy="290" rx="75" ry="22" fill="#3a6e3a" opacity="0.5" transform="rotate(20 240 290)" />
                    <ellipse cx="170" cy="220" rx="80" ry="25" fill="#264d26" opacity="0.45" transform="rotate(50 170 220)" />
                    <ellipse cx="260" cy="160" rx="65" ry="18" fill="#4a7a4a" opacity="0.4" transform="rotate(15 260 160)" />
                    <ellipse cx="190" cy="530" rx="100" ry="32" fill="#1e4a1e" opacity="0.6" transform="rotate(40 190 530)" />
                    <ellipse cx="270" cy="455" rx="70" ry="20" fill="#355a35" opacity="0.45" transform="rotate(25 270 455)" />

                    <circle cx="230" cy="350" r="8" fill="#5a8a3a" opacity="0.7" />
                    <circle cx="215" cy="370" r="6" fill="#6a9a4a" opacity="0.6" />
                    <circle cx="245" cy="385" r="7" fill="#4a7a2a" opacity="0.65" />
                </svg>


                <svg className="botanical-top-right" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M180 0 Q160 80 120 140 Q90 200 100 300" stroke="#2d5a2d" strokeWidth="2" fill="none" opacity="0.5" />
                    <ellipse cx="130" cy="100" rx="55" ry="18" fill="#3a6e3a" opacity="0.4" transform="rotate(25 130 100)" />
                    <ellipse cx="105" cy="180" rx="50" ry="16" fill="#264d26" opacity="0.35" transform="rotate(-15 105 180)" />
                </svg>
            </div>

            {/* Hero Content */}
            <div className="hero-content">
                <div className="hero-text">
                    <p className="hero-tagline">{slide.tagline}</p>

                    <h1 className="hero-title">
                        {slide.title}
                        <span>{slide.titleHighlight}</span>
                    </h1>
                    <span className="hero-title-underline" />

                    <p className="hero-subtitle">{slide.subtitle}</p>

                    <div className="hero-cta-group">
                        <a href="#shop" className="btn-primary" id="hero-shop-btn">
                            Shop Now
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                        <a href="#about" className="btn-outline" id="hero-about-btn">Discover More</a>
                    </div>
                </div>

                {/* Floating product imagery */}

            </div>

            {/* Slider Controls */}
            <button
                className="hero-arrow hero-arrow-left"
                onClick={() => goToSlide(currentSlide - 1)}
                aria-label="Previous slide"
                id="hero-prev-btn"
            >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <button
                className="hero-arrow hero-arrow-right"
                onClick={() => goToSlide(currentSlide + 1)}
                aria-label="Next slide"
                id="hero-next-btn"
            >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {/* Slide dots */}
            <div style={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 5 }}>
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        style={{
                            width: i === currentSlide ? '28px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            background: i === currentSlide ? 'var(--gold)' : 'rgba(255,255,255,0.35)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.4s ease',
                            padding: 0,
                        }}
                    />
                ))}
            </div>

            {/* Scroll indicator */}
            <div className="hero-scroll-indicator" aria-hidden="true">
                <div className="scroll-dot" />
                <span>Scroll</span>
            </div>
        </section>
    );
}
