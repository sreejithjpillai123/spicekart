'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';

const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '/about' },
    { label: 'Shop', href: '/shop' },
    { label: 'Recipes', href: '#recipes' },
    { label: 'Blogs', href: '#blogs' },
    { label: 'CSR', href: '#csr' },
    { label: 'FAQs', href: '#faqs' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [menuOpen, setMenuOpen] = useState(false);
    const { totalItems } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
            const sections = navLinks.map(l => l.href.replace('#', ''));
            for (let i = sections.length - 1; i >= 0; i--) {
                const el = document.getElementById(sections[i]);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 120) {
                        setActiveSection(sections[i]);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on scroll
    useEffect(() => {
        if (menuOpen) {
            const close = () => setMenuOpen(false);
            window.addEventListener('scroll', close, { passive: true, once: true });
            return () => window.removeEventListener('scroll', close);
        }
    }, [menuOpen]);

    const pathname = usePathname();

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (!href.startsWith('#')) {
            setMenuOpen(false);
            return;
        }
        e.preventDefault();
        setMenuOpen(false);
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <>
            <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
                <Link href="/" className="navbar-logo" aria-label="Spice Home" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <Image
                        src="/images/logo.png"
                        alt="Spice Logo"
                        width={64}
                        height={64}
                        priority
                        className="navbar-brand-logo"
                    />
                    <span className="navbar-brand-text" style={{ color: 'white' }}>
                        SpiceKart
                    </span>
                </Link>

                <ul className="navbar-links" role="list">
                    {navLinks.map((link) => {
                        const isRoute = !link.href.startsWith('#');
                        const isActive = isRoute
                            ? pathname === link.href
                            : activeSection === link.href.replace('#', '');
                        return (
                            <li key={link.href}>
                                {isRoute ? (
                                    <Link href={link.href} className={isActive ? 'active' : ''} aria-current={isActive ? 'page' : undefined}>
                                        {link.label}
                                    </Link>
                                ) : (
                                    <a href={link.href} className={isActive ? 'active' : ''} onClick={(e) => handleNavClick(e, link.href)} aria-current={isActive ? 'page' : undefined}>
                                        {link.label}
                                    </a>
                                )}
                            </li>
                        );
                    })}
                </ul>

                <div className="navbar-actions">
                    <button className="nav-icon-btn" aria-label="Account">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
                        </svg>
                    </button>
                    <button className="nav-icon-btn" aria-label="Search">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m16.5 16.5 4 4" strokeLinecap="round" />
                        </svg>
                    </button>
                    <Link href="/cart" className="nav-icon-btn cart-badge" aria-label={`Shopping cart, ${totalItems} items`}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                    </Link>

                    {/* Hamburger button – visible only on mobile */}
                    <button
                        className={`hamburger-btn${menuOpen ? ' open' : ''}`}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(prev => !prev)}
                    >
                        <span className="hamburger-bar" />
                        <span className="hamburger-bar" />
                        <span className="hamburger-bar" />
                    </button>
                </div>
            </nav>

            {/* Mobile drawer overlay */}
            {menuOpen && (
                <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />
            )}

            {/* Mobile drawer */}
            <div className={`mobile-menu-drawer${menuOpen ? ' open' : ''}`} role="dialog" aria-label="Mobile navigation">
                <ul className="mobile-menu-links" role="list">
                    {navLinks.map((link) => {
                        const isRoute = !link.href.startsWith('#');
                        const isActive = isRoute
                            ? pathname === link.href
                            : activeSection === link.href.replace('#', '');
                        return (
                            <li key={link.href}>
                                {isRoute ? (
                                    <Link
                                        href={link.href}
                                        className={isActive ? 'active' : ''}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ) : (
                                    <a
                                        href={link.href}
                                        className={isActive ? 'active' : ''}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                    >
                                        {link.label}
                                    </a>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}
