'use client';
import { useEffect, useRef } from 'react';

// Cube face images — warm spice tones from Shopify CDN used in the project
const FACE_IMAGES = [
    'https://www.emperorakbar.com/cdn/shop/files/EAC_Website_MISC-07_869af3c3-d169-449d-a9dc-1db16cf3e7a4_1080x.png?v=1625644495',
    'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-14.png?v=1625572139',
    'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-15.png?v=1625572139',
    'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-16.png?v=1625572139',
    'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-17.png?v=1625572139',
    'https://e7.pngegg.com/pngimages/118/390/png-clipart-green-vegetable-lot-true-cardamom-indian-cuisine-black-cardamom-spice-spice-food-superfood.png',
];

// Each cube: initial (flies in from -30000z deep) → final resting position
const CUBES_DATA = [
    { id: 'cf-cube-1', init: { top: -55, left: 37.5, rx: 360, ry: -360, rz: -48, z: -30000 }, final: { top: 50, left: 15, rx: 0, ry: 3, rz: 0, z: 0 } },
    { id: 'cf-cube-2', init: { top: -35, left: 32.5, rx: -360, ry: 360, rz: 90, z: -30000 }, final: { top: 75, left: 25, rx: 1, ry: 2, rz: 0, z: 0 } },
    { id: 'cf-cube-3', init: { top: -65, left: 50, rx: -360, ry: -360, rz: -180, z: -30000 }, final: { top: 25, left: 25, rx: -1, ry: 2, rz: 0, z: 0 } },
    { id: 'cf-cube-4', init: { top: -35, left: 50, rx: -360, ry: -360, rz: -180, z: -30000 }, final: { top: 75, left: 75, rx: 1, ry: -2, rz: 0, z: 0 } },
    { id: 'cf-cube-5', init: { top: -55, left: 62.5, rx: 360, ry: 360, rz: -135, z: -30000 }, final: { top: 25, left: 75, rx: -1, ry: -2, rz: 0, z: 0 } },
    { id: 'cf-cube-6', init: { top: -35, left: 67.5, rx: -180, ry: -360, rz: -180, z: -30000 }, final: { top: 50, left: 85, rx: 0, ry: -3, rz: 0, z: 0 } },
];

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

export default function CubeFlythrough() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const cubesRef = useRef<HTMLDivElement>(null);
    const header1Ref = useRef<HTMLDivElement>(null);
    const header2Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const sticky = stickyRef.current;
        const cubesEl = cubesRef.current;
        const h1 = header1Ref.current;
        const h2 = header2Ref.current;
        if (!wrap || !sticky || !cubesEl || !h1 || !h2) return;

        const onScroll = () => {
            const rect = wrap.getBoundingClientRect();
            const stickyH = window.innerHeight * 4;
            // progress 0→1 over the scroll distance
            const scrolled = -rect.top;
            const progress = Math.max(0, Math.min(scrolled / stickyH, 1));

            // Phase 1: cubes fly in (0 → 1.0 of progress)
            const phase1 = Math.min(progress * 2, 1);
            // Phase 2: cube-2 and cube-4 extra rotation (after 50%)
            const phase2 = progress >= 0.5 ? (progress - 0.5) * 2 : 0;

            // Header-1 scale up + blur out
            const h1p = Math.min(progress * 2.5, 1);
            h1.style.transform = `translate(-50%, -50%) scale(${lerp(1, 1.5, h1p)})`;
            h1.style.filter = `blur(${lerp(0, 20, h1p)}px)`;
            h1.style.opacity = String(1 - h1p);

            // Header-2 fades in after 40% progress
            const h2start = (progress - 0.4) * 10;
            const h2p = Math.max(0, Math.min(h2start, 1));
            h2.style.transform = `translate(-50%, -50%) scale(${lerp(0.75, 1, h2p)})`;
            h2.style.filter = `blur(${lerp(10, 0, h2p)}px)`;
            h2.style.opacity = String(h2p);

            // Cubes opacity — fade in shortly after scroll starts
            const cubesOpacity = progress > 0.01 ? Math.min((progress - 0.01) * 100, 1) : 0;
            cubesEl.style.opacity = String(cubesOpacity);

            // Move each cube
            CUBES_DATA.forEach(({ id, init, final }) => {
                const cube = document.getElementById(id);
                if (!cube) return;
                const top = lerp(init.top, final.top, phase1);
                const left = lerp(init.left, final.left, phase1);
                const rx = lerp(init.rx, final.rx, phase1);
                let ry = lerp(init.ry, final.ry, phase1);
                const rz = lerp(init.rz, final.rz, phase1);
                const z = lerp(init.z, final.z, phase1);
                if (id === 'cf-cube-2') ry += lerp(0, 180, phase2);
                if (id === 'cf-cube-4') ry += lerp(0, -180, phase2);
                cube.style.top = `${top}%`;
                cube.style.left = `${left}%`;
                cube.style.transform = `translate3d(-50%, -50%, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        /* Outer wrapper — tall enough to pin the sticky section for scroll travel */
        <div ref={wrapRef} style={{ height: '500vh', position: 'relative' }}>
            {/* Sticky viewport-filling panel */}
            <div ref={stickyRef} className="cf-sticky">
                {/* 3-D cubes container */}
                <div ref={cubesRef} className="cf-cubes">
                    {CUBES_DATA.map(({ id, init }, ci) => (
                        <div
                            key={id}
                            id={id}
                            className="cf-cube"
                            style={{
                                top: `${init.top}%`,
                                left: `${init.left}%`,
                                transform: `translate3d(-50%, -50%, ${init.z}px) rotateX(${init.rx}deg) rotateY(${init.ry}deg) rotateZ(${init.rz}deg)`,
                            }}
                        >
                            {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face, fi) => (
                                <div key={face} className={`cf-face cf-${face}`}>
                                    <img
                                        src={FACE_IMAGES[(ci * 6 + fi) % FACE_IMAGES.length]}
                                        alt=""
                                        aria-hidden="true"
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Header 1 — visible at start, zooms + blurs out */}
                <div ref={header1Ref} className="cf-header-1">
                    <h2>The world&apos;s finest<br />spices. Sourced at origin.</h2>
                </div>

                {/* Header 2 — fades in at ~40% */}
                <div ref={header2Ref} className="cf-header-2">
                    <h3>Where innovation meets purity.</h3>
                    <p>
                        Spice unites visionary farmers, quality experts and passionate traders —
                        delivering single-origin cardamom and pepper that inspire every dish.
                    </p>
                </div>
            </div>
        </div>
    );
}
