'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Image from 'next/image';

export default function AboutPage() {
    const [videoPlaying, setVideoPlaying] = useState(false);

    // Scroll-reveal
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                    observer.unobserve(e.target);
                }
            }),
            { threshold: 0.12 }
        );
        document.querySelectorAll('.about-reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Navbar />

            {/* ─── Hero Banner ─── */}
            <section style={{
                position: 'relative',
                height: '320px',
                background: '#2e3330',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                paddingTop: '80px', /* navbar height */
            }}>
                {/* Sketch hatch overlay — mimics the antique etched illustration */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
                        repeating-linear-gradient(
                            -55deg,
                            transparent,
                            transparent 3px,
                            rgba(255,255,255,0.015) 3px,
                            rgba(255,255,255,0.015) 4px
                        )
                    `,
                    zIndex: 0,
                }} />

                {/* Faint harbor/boat sketch shapes in center background */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07, zIndex: 0 }} viewBox="0 0 1200 320" fill="none" preserveAspectRatio="xMidYMid slice">
                    {/* Simple boat hull */}
                    <path d="M420 220 Q600 200 780 220 L800 260 Q600 280 400 260 Z" stroke="#ccc" strokeWidth="1" fill="none" />
                    <path d="M580 220 L580 120 L680 180" stroke="#ccc" strokeWidth="1" fill="none" />
                    <path d="M580 120 L500 200" stroke="#ccc" strokeWidth="0.8" fill="none" />
                    {/* Water lines */}
                    <path d="M350 270 Q600 260 850 270" stroke="#ccc" strokeWidth="0.6" fill="none" />
                    <path d="M300 285 Q600 275 900 285" stroke="#ccc" strokeWidth="0.4" fill="none" />
                </svg>

                {/* ── LEFT BOTANICAL SVG ── */}
                <svg style={{ position: 'absolute', left: 0, bottom: 0, height: '105%', zIndex: 1, opacity: 0.9 }} viewBox="0 0 280 360" fill="none">
                    {/* Main tall leaf left */}
                    <path d="M60 360 Q40 260 70 180 Q90 120 60 60" stroke="#5a7a44" strokeWidth="2" fill="none" />
                    <path d="M60 60 Q100 120 80 200 Q65 270 80 360" stroke="#5a7a44" strokeWidth="1.5" fill="rgba(60,90,40,0.4)" />
                    {/* Leaf veins */}
                    <path d="M60 160 Q80 145 95 155" stroke="#4a6a34" strokeWidth="1" fill="none" />
                    <path d="M63 200 Q82 185 97 192" stroke="#4a6a34" strokeWidth="1" fill="none" />
                    <path d="M65 240 Q80 228 93 235" stroke="#4a6a34" strokeWidth="0.8" fill="none" />

                    {/* Second leaf — arching right */}
                    <path d="M30 360 Q10 300 30 240 Q60 180 120 140" stroke="#4a7a30" strokeWidth="1.8" fill="none" />
                    <path d="M120 140 Q90 190 70 250 Q50 310 65 360" stroke="#4a7a30" strokeWidth="1.2" fill="rgba(50,80,30,0.3)" />

                    {/* Small flower — left side (6 petals, static to avoid SSR float mismatch) */}
                    <circle cx="115" cy="128" r="10" stroke="#c8a96e" strokeWidth="1.5" fill="none" />
                    <circle cx="115" cy="128" r="4" fill="#c8a96e" opacity="0.6" />
                    <ellipse cx="131" cy="128" rx="6" ry="4" transform="rotate(0 131 128)" stroke="#c8a96e" strokeWidth="1" fill="none" opacity="0.7" />
                    <ellipse cx="123" cy="141.86" rx="6" ry="4" transform="rotate(60 123 141.86)" stroke="#c8a96e" strokeWidth="1" fill="none" opacity="0.7" />
                    <ellipse cx="107" cy="141.86" rx="6" ry="4" transform="rotate(120 107 141.86)" stroke="#c8a96e" strokeWidth="1" fill="none" opacity="0.7" />
                    <ellipse cx="99" cy="128" rx="6" ry="4" transform="rotate(180 99 128)" stroke="#c8a96e" strokeWidth="1" fill="none" opacity="0.7" />
                    <ellipse cx="107" cy="114.14" rx="6" ry="4" transform="rotate(240 107 114.14)" stroke="#c8a96e" strokeWidth="1" fill="none" opacity="0.7" />
                    <ellipse cx="123" cy="114.14" rx="6" ry="4" transform="rotate(300 123 114.14)" stroke="#c8a96e" strokeWidth="1" fill="none" opacity="0.7" />

                    {/* Third narrow leaf */}
                    <path d="M0 340 Q20 280 50 220 Q80 170 110 150" stroke="#3a6028" strokeWidth="1.5" fill="none" />
                    <path d="M110 150 Q75 175 45 235 Q20 295 10 355" stroke="#3a6028" strokeWidth="1" fill="rgba(40,70,25,0.25)" />

                    {/* Ground stem */}
                    <path d="M40 360 Q55 330 65 300" stroke="#4a6a34" strokeWidth="2" fill="none" />
                </svg>

                {/* ── RIGHT BOTANICAL SVG ── */}
                <svg style={{ position: 'absolute', right: 0, bottom: 0, height: '105%', zIndex: 1, opacity: 0.9 }} viewBox="0 0 280 360" fill="none">
                    {/* Mirror: Main tall leaf */}
                    <path d="M220 360 Q240 260 210 180 Q190 120 220 60" stroke="#5a7a44" strokeWidth="2" fill="none" />
                    <path d="M220 60 Q180 120 200 200 Q215 270 200 360" stroke="#5a7a44" strokeWidth="1.5" fill="rgba(60,90,40,0.4)" />
                    <path d="M220 160 Q200 145 185 155" stroke="#4a6a34" strokeWidth="1" fill="none" />
                    <path d="M217 200 Q198 185 183 192" stroke="#4a6a34" strokeWidth="1" fill="none" />
                    <path d="M215 240 Q200 228 187 235" stroke="#4a6a34" strokeWidth="0.8" fill="none" />

                    {/* Second leaf */}
                    <path d="M250 360 Q270 300 250 240 Q220 180 160 140" stroke="#4a7a30" strokeWidth="1.8" fill="none" />
                    <path d="M160 140 Q190 190 210 250 Q230 310 215 360" stroke="#4a7a30" strokeWidth="1.2" fill="rgba(50,80,30,0.3)" />

                    {/* Smaller flower right (5 petals, static to avoid SSR float mismatch) */}
                    <circle cx="165" cy="128" r="8" stroke="#c8a96e" strokeWidth="1.3" fill="none" />
                    <circle cx="165" cy="128" r="3" fill="#c8a96e" opacity="0.5" />
                    <ellipse cx="178" cy="128" rx="5" ry="3" transform="rotate(0 178 128)" stroke="#c8a96e" strokeWidth="1" fill="none" opacity="0.6" />
                    <ellipse cx="169.02" cy="140.36" rx="5" ry="3" transform="rotate(72 169.02 140.36)" stroke="#c8a96e" strokeWidth="1" fill="none" opacity="0.6" />
                    <ellipse cx="154.48" cy="135.64" rx="5" ry="3" transform="rotate(144 154.48 135.64)" stroke="#c8a96e" strokeWidth="1" fill="none" opacity="0.6" />
                    <ellipse cx="154.48" cy="120.36" rx="5" ry="3" transform="rotate(216 154.48 120.36)" stroke="#c8a96e" strokeWidth="1" fill="none" opacity="0.6" />
                    <ellipse cx="169.02" cy="115.64" rx="5" ry="3" transform="rotate(288 169.02 115.64)" stroke="#c8a96e" strokeWidth="1" fill="none" opacity="0.6" />

                    {/* Third narrow leaf */}
                    <path d="M280 340 Q260 280 230 220 Q200 170 170 150" stroke="#3a6028" strokeWidth="1.5" fill="none" />
                    <path d="M170 150 Q205 175 235 235 Q260 295 270 355" stroke="#3a6028" strokeWidth="1" fill="rgba(40,70,25,0.25)" />

                    <path d="M240 360 Q225 330 215 300" stroke="#4a6a34" strokeWidth="2" fill="none" />
                </svg>

                {/* ── Centered "About" Title ── */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <h1 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(38px, 5vw, 68px)',
                        fontWeight: 500,
                        color: '#ffffff',
                        letterSpacing: '2px',
                        textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                    }}>About</h1>
                </div>

                {/* ── Product Pack — right of center ── */}
                <div style={{
                    position: 'absolute',
                    right: '14%',
                    bottom: '0',
                    zIndex: 3,
                    filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.5))',
                }}>
                    {/* Bag shape */}
                    <div style={{
                        width: '116px',
                        height: '210px',
                        borderRadius: '8px 8px 6px 6px',
                        overflow: 'hidden',
                        boxShadow: '4px 0 20px rgba(0,0,0,0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        {/* Pink top band */}
                        <div style={{
                            background: 'linear-gradient(135deg, #e8558a, #c03060)',
                            height: '52px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px',
                            flexDirection: 'column',
                        }}>
                            <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '7px', fontWeight: 800, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase' }}>SPICE</div>
                            <div style={{ width: '60px', height: '1px', background: 'rgba(255,255,255,0.5)', margin: '3px 0' }} />
                            <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '6px', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.5px' }}>Alleppey · Kerala</div>
                        </div>
                        {/* Green body */}
                        <div style={{
                            background: 'linear-gradient(160deg, #5a9a3a, #3d6a28)',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px 8px',
                            gap: '6px',
                        }}>
                            <span style={{ fontSize: '28px' }}>🌿</span>
                            <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '7.5px', fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.4, letterSpacing: '0.5px' }}>
                                NATURAL GREEN<br />CARDAMOM
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.15)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '2px',
                                padding: '2px 8px',
                                fontFamily: 'Jost, sans-serif',
                                fontSize: '6px',
                                color: '#fff',
                                letterSpacing: '1px',
                            }}>
                                100% NATURAL
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom gradient fade */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px',
                    background: 'linear-gradient(to bottom, transparent, rgba(46,51,48,0.3))',
                    zIndex: 1, pointerEvents: 'none',
                }} />
            </section>



            {/* ─── Origins Section ─── */}
            <section style={{
                background: '#ffffff',
                padding: '60px 80px 80px',
                textAlign: 'center',
                marginTop: '-40px',
                borderRadius: '18px 18px 0 0',
                position: 'relative',
                zIndex: 2,
                boxShadow: '0 -4px 30px rgba(0,0,0,0.12)',
            }}>

                <div className="about-reveal" style={{ opacity: 0, transform: 'translateY(24px)', transition: 'all 0.7s ease' }}>
                    <h2 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(24px, 3vw, 40px)',
                        fontWeight: 600,
                        color: '#2c2c2c',
                        marginBottom: '36px',


                    }}>
                        The Origins of the World&apos;s Best Cardamom
                    </h2>
                </div>

                <div className="about-reveal" style={{ opacity: 0, transform: 'translateY(24px)', transition: 'all 0.7s ease 0.1s', maxWidth: '820px', margin: '0 auto' }}>
                    {[
                        'We are renowned the world over for our premium cardamom. We have been authorized to use the GI tag "Alleppey Green Cardamom" as per the Geographical Indications of Goods (Registration and Protection) Act, 1999. And there\'s also a lovely little backstory to it all.',
                        'Cut to the 18th century... the gentle slopes of Kerala were lush with cardamom plantations. A spice whose demand dated back to historic times, and whose popularity had only strengthened with the passage of time.',
                        'Merchants from around the world were taking the arduous sea route just to lay their hands on this Queen of Spices. Realising the global demand for what grew liberally around the kingdom, the Raja of Travancore sniffed a huge opportunity. He decreed that all produce be mandatorily sold only to his official, who would forward it to the main depot in Alleppey, which was then the most important trading port on the Malabar Coast.',
                    ].map((para, i) => (
                        <p key={i} style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '18px',
                            color: i === 0 ? '#4a6741' : '#555',
                            lineHeight: 1.85,
                            marginBottom: '22px',
                            textAlign: 'center',
                        }}>
                            {para}
                        </p>
                    ))}
                </div>
            </section>

            {/* ─── Brand Story Section ─── */}
            <section style={{
                background: '#faf8f4',
                padding: '80px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '60px',
                alignItems: 'center',
                maxWidth: '1200px',
                margin: '0 auto',
            }}>
                {/* Left: Sack image placeholder */}
                <div className="about-reveal" style={{ opacity: 0, transform: 'translateX(-24px)', transition: 'all 0.8s ease' }}>
                    <div style={{
                        width: '100%',
                        aspectRatio: '4/3',
                        background: 'linear-gradient(135deg, #e8d5a0 0%, #c8a855 40%, #a07830 100%)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Jute sack shape */}
                        <div style={{
                            width: '200px',
                            height: '180px',
                            background: 'linear-gradient(180deg, #8b6914 0%, #5a4010 100%)',
                            borderRadius: '40% 40% 50% 50% / 30% 30% 60% 60%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                        }}>
                            <span style={{ fontSize: '60px' }}>🌿</span>
                        </div>
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontFamily: 'Jost, sans-serif',
                            fontSize: '10px',
                            letterSpacing: '2px',
                            color: 'rgba(255,255,255,0.6)',
                            textTransform: 'uppercase',
                        }}>
                            Idukki · Kerala
                        </div>
                    </div>
                </div>

                {/* Right: Text */}
                <div className="about-reveal" style={{ opacity: 0, transform: 'translateX(24px)', transition: 'all 0.8s ease 0.1s' }}>
                    <h2 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(22px, 2.5vw, 34px)',
                        fontWeight: 600,
                        color: '#2c2c2c',
                        marginBottom: '24px',
                    }}>
                        The Spice Brand Story
                    </h2>

                    {[
                        'We are the flagship brand for one of India\'s oldest spice export families. The business was traditionally dealing in the export of spices and green cardamom was a part of the mixed basket of the products it exported.',
                        'Historically, cardamom was sold loose in plastic or jute bags. As a consequence, it would quickly lose its aroma and potency. And, as we all know, cardamom without aroma or flavour is of very little value.',
                        'We knew the gamechanger lay in doing something that would lock in the aroma and flavour for years. That realisation led to the birth of our brand. We introduced the world\'s first ever Aroma-Lock technology for cardamom packaging.',
                        'We are now exporting Green Cardamoms to 25+ countries and growing in popularity around the world. A big thank you for all the love and support!',
                    ].map((para, i) => (
                        <p key={i} style={{
                            fontFamily: i === 0 ? 'Jost, sans-serif' : 'Cormorant Garamond, serif',
                            fontSize: i === 0 ? '14px' : '17px',
                            color: '#555',
                            lineHeight: 1.85,
                            marginBottom: '16px',
                        }}>
                            {para}
                        </p>
                    ))}
                </div>
            </section>

            {/* ─── Export Award Section ─── */}
            <section style={{
                background: '#ffffff',
                padding: '80px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '60px',
                alignItems: 'center',
                maxWidth: '1200px',
                margin: '0 auto',
            }}>
                {/* Left: Text */}
                <div className="about-reveal" style={{ opacity: 0, transform: 'translateY(24px)', transition: 'all 0.7s ease' }}>
                    <h2 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(22px, 2.5vw, 34px)',
                        fontWeight: 600,
                        color: '#2c2c2c',
                        marginBottom: '28px',
                        lineHeight: 1.3,
                    }}>
                        The World&apos;s Best Cardamom Brand is also India&apos;s Topmost Cardamom Exporter
                    </h2>

                    {[
                        'We have been recognised as the Largest Exporter of Green Cardamom for the year 2018-19 & 2019-20, by the Spices Board of India, Ministry of Commerce, Government of India.',
                        'Edging out competition from the traditionally exported unbranded Cardamoms or Cardamoms under private labels of foreign importers, an Indian brand of Green Cardamoms is now the Top Most exporter. This is a critical shift in the nature of exports of Indian Cardamoms and we are grateful to the Spices Board for their encouragement.',
                        'We are now exporting Green Cardamoms to 25 countries and growing in popularity around the world. A big thank you for all the love and support!',
                    ].map((para, i) => (
                        <p key={i} style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '17px',
                            color: '#555',
                            lineHeight: 1.85,
                            marginBottom: '16px',
                        }}>
                            {para}
                        </p>
                    ))}
                </div>

                {/* Right: Award trophy */}
                <div className="about-reveal" style={{ opacity: 0, transform: 'translateX(24px)', transition: 'all 0.8s ease 0.15s' }}>
                    <div style={{
                        width: '100%',
                        aspectRatio: '4/3',
                        background: 'linear-gradient(135deg, #1a2e12 0%, #2a4a1a 50%, #1a3a10 100%)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: '16px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Leaf decoration */}
                        {[{ l: '-30px', t: '-20px' }, { r: '-20px', t: '10px' }, { l: '10px', b: '-20px' }].map((pos, i) => (
                            <div key={i} style={{
                                position: 'absolute',
                                left: (pos as any).l, right: (pos as any).r, top: (pos as any).t, bottom: (pos as any).b,
                                width: '120px', height: '180px',
                                background: 'rgba(74,120,50,0.4)',
                                borderRadius: '50% 50% 10% 50% / 60% 60% 20% 60%',
                                transform: `rotate(${i * 60}deg)`,
                            }} />
                        ))}

                        {/* Trophy */}
                        <div style={{
                            zIndex: 1,
                            textAlign: 'center',
                        }}>
                            <div style={{
                                width: '80px',
                                height: '120px',
                                background: 'linear-gradient(160deg, #c8900a, #8a5a05)',
                                borderRadius: '12px 12px 4px 4px',
                                margin: '0 auto 12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                            }}>
                                <span style={{ fontSize: '32px' }}>🏆</span>
                            </div>
                            <div style={{
                                background: 'rgba(180,30,30,0.9)',
                                borderRadius: '4px',
                                padding: '10px 20px',
                                maxWidth: '220px',
                                margin: '0 auto',
                            }}>
                                <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', color: '#fff', textTransform: 'uppercase', marginBottom: '4px' }}>Export Award</div>
                                <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                                    Top Exporter of Cardamom<br />— Spices Board of India
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Video Section ─── */}
            <section style={{
                position: 'relative',
                height: '420px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0d1a08',
            }}>
                {/* Video */}
                <video
                    autoPlay={videoPlaying}
                    muted
                    loop
                    playsInline
                    id="about-video"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0,
                    }}
                >
                    <source src="/videos/cardamom.mp4" type="video/mp4" />
                </video>

                {/* Dark overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(8,14,5,0.52)',
                    zIndex: 1,
                }} />

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 40px' }}>
                    {/* Play button */}
                    {!videoPlaying && (
                        <button
                            onClick={() => {
                                setVideoPlaying(true);
                                const v = document.getElementById('about-video') as HTMLVideoElement;
                                if (v) v.play();
                            }}
                            aria-label="Play video"
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                border: '2px solid rgba(255,255,255,0.8)',
                                background: 'rgba(255,255,255,0.12)',
                                backdropFilter: 'blur(6px)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 28px',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.25)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)';
                            }}
                        >
                            <svg width="18" height="20" viewBox="0 0 18 20" fill="white">
                                <path d="M1 1L17 10L1 19V1Z" />
                            </svg>
                        </button>
                    )}
                    <h2 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(28px, 4vw, 52px)',
                        fontWeight: 500,
                        color: '#ffffff',
                        textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                        marginBottom: '14px',
                    }}>
                        The World&apos;s Best Cardamom
                    </h2>
                    <p style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '18px',
                        color: 'rgba(255,255,255,0.75)',
                    }}>
                        A treasure trove of aroma, flavour and health.
                    </p>
                </div>
            </section>

            {/* ─── Subscribe Section ─── */}
            <section style={{
                background: '#faf8f4',
                padding: '80px 40px',
                textAlign: 'center',
                borderTop: '1px solid rgba(0,0,0,0.06)',
            }}>
                <div className="about-reveal" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.7s ease' }}>
                    {/* Envelope icon */}
                    <svg width="36" height="28" viewBox="0 0 36 28" fill="none" style={{ marginBottom: '20px' }}>
                        <rect x="1" y="1" width="34" height="26" rx="2" stroke="#4a6741" strokeWidth="1.5" />
                        <path d="M1 4L18 16L35 4" stroke="#4a6741" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>

                    <h3 style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '26px',
                        fontWeight: 500,
                        color: '#4a6741',
                        marginBottom: '32px',
                    }}>
                        Subscribe for new offers
                    </h3>

                    <div style={{
                        display: 'flex',
                        gap: '0',
                        maxWidth: '480px',
                        margin: '0 auto',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                    }}>
                        <input
                            type="email"
                            placeholder="Email address"
                            id="about-newsletter-email"
                            style={{
                                flex: 1,
                                fontFamily: 'Jost, sans-serif',
                                fontSize: '13px',
                                padding: '14px 20px',
                                border: '1px solid #d8d0c0',
                                borderRight: 'none',
                                outline: 'none',
                                background: '#fff',
                                color: '#2c2c2c',
                            }}
                        />
                        <button
                            id="about-newsletter-btn"
                            style={{
                                fontFamily: 'Jost, sans-serif',
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                background: '#4a6741',
                                color: '#fff',
                                border: 'none',
                                padding: '14px 28px',
                                cursor: 'pointer',
                                transition: 'background 0.3s ease',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#3a5531'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#4a6741'; }}
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            {/* Scroll-reveal CSS injected inline */}
            <style>{`
                .about-reveal.revealed {
                    opacity: 1 !important;
                    transform: translate(0,0) !important;
                }
            `}</style>
        </>
    );
}
