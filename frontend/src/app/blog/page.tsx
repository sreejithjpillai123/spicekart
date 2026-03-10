'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getBlogs, type Blog } from '../lib/api';

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        getBlogs()
            .then(data => setBlogs(data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const categories = ['All', ...Array.from(new Set(blogs.map(b => b.category)))];

    const filtered = blogs.filter(b => {
        const matchCat = selectedCategory === 'All' || b.category === selectedCategory;
        const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.excerpt.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <>
            <Navbar />

            {/* ─── Hero ─── */}
            <section style={{
                background: 'linear-gradient(135deg, #1a2b15 0%, #2a4020 100%)',
                padding: '100px 60px 60px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(200,169,110,0.03) 4px, rgba(200,169,110,0.03) 5px)`,
                }} />
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', letterSpacing: '3px', color: '#c8a96e', textTransform: 'uppercase', marginBottom: '16px' }}>
                    Stories & Insights
                </p>
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 500, color: '#fff', marginBottom: '16px' }}>
                    The SpiceKart Blog
                </h1>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.7 }}>
                    Recipes, spice guides, farm stories and more from the heart of Kerala.
                </p>

                {/* Search */}
                <div style={{ display: 'flex', maxWidth: '480px', margin: '0 auto', gap: '0' }}>
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            flex: 1, padding: '14px 20px', border: 'none', borderRadius: '8px 0 0 8px',
                            fontFamily: 'Jost, sans-serif', fontSize: '14px', outline: 'none',
                        }}
                    />
                    <button style={{
                        padding: '14px 24px', background: '#c8a96e', color: '#fff', border: 'none',
                        borderRadius: '0 8px 8px 0', fontFamily: 'Jost, sans-serif', fontSize: '13px',
                        fontWeight: 700, cursor: 'pointer',
                    }}>
                        Search
                    </button>
                </div>
            </section>

            {/* ─── Category Filter ─── */}
            <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '16px 60px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                        padding: '7px 18px', borderRadius: '20px', border: '1px solid',
                        borderColor: selectedCategory === cat ? '#4a6741' : '#ddd',
                        background: selectedCategory === cat ? '#4a6741' : '#fff',
                        color: selectedCategory === cat ? '#fff' : '#666',
                        fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 500,
                        cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* ─── Blog Grid ─── */}
            <section style={{ background: '#faf8f4', padding: '60px', minHeight: '400px' }}>
                {loading && (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                        <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px' }}>Loading articles…</div>
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                        <div style={{ fontSize: '40px', marginBottom: '16px' }}>📝</div>
                        <p style={{ fontFamily: 'Jost, sans-serif' }}>
                            {blogs.length === 0 ? 'No blog posts published yet. Check back soon!' : 'No posts match your search.'}
                        </p>
                    </div>
                )}

                {!loading && filtered.length > 0 && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px',
                        maxWidth: '900px',

                        margin: '0 auto',
                    }}>
                        {filtered.map(blog => (
                            <article
                                key={blog._id}
                                onClick={() => setSelectedBlog(blog)}
                                style={{
                                    background: '#fff', borderRadius: '12px', overflow: 'hidden',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    border: '1px solid rgba(0,0,0,0.04)',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                                }}
                            >
                                {/* Cover */}
                                <div style={{ height: '200px', background: '#f0f4ec', overflow: 'hidden', position: 'relative' }}>
                                    {blog.coverImage ? (
                                        <img src={blog.coverImage} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{
                                            height: '100%', background: 'linear-gradient(135deg, #2a4020, #4a6741)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <span style={{ fontSize: '48px' }}>🌿</span>
                                        </div>
                                    )}
                                    {blog.featured && (
                                        <div style={{
                                            position: 'absolute', top: '12px', left: '12px',
                                            background: '#c8a96e', color: '#fff',
                                            fontFamily: 'Jost, sans-serif', fontSize: '10px', fontWeight: 700,
                                            letterSpacing: '1px', padding: '4px 10px', borderRadius: '4px',
                                        }}>
                                            FEATURED
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                                        <span style={{
                                            background: '#e8f0e0', color: '#4a6741',
                                            fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 700,
                                            padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px',
                                        }}>
                                            {blog.category}
                                        </span>
                                        <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#999' }}>
                                            {blog.readTime} min read
                                        </span>
                                    </div>
                                    <h2 style={{
                                        fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 500,
                                        color: '#1a2b15', marginBottom: '10px', lineHeight: 1.3,
                                    }}>
                                        {blog.title}
                                    </h2>
                                    <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: '#666', lineHeight: 1.7, marginBottom: '16px' }}>
                                        {blog.excerpt}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#888' }}>
                                            By {blog.author}
                                        </span>
                                        <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#4a6741', fontWeight: 600 }}>
                                            Read More →
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {/* ─── Blog Reader Modal ─── */}
            {selectedBlog && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                    zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                    padding: '40px 20px', overflowY: 'auto',
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '16px', maxWidth: '800px', width: '100%',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden',
                    }}>
                        {/* Cover */}
                        {selectedBlog.coverImage && (
                            <div style={{ height: '300px', overflow: 'hidden' }}>
                                <img src={selectedBlog.coverImage} alt={selectedBlog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}

                        <div style={{ padding: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                                <div>
                                    <span style={{
                                        background: '#e8f0e0', color: '#4a6741', fontFamily: 'Jost, sans-serif',
                                        fontSize: '11px', fontWeight: 700, padding: '4px 12px',
                                        borderRadius: '20px', display: 'inline-block', marginBottom: '12px',
                                    }}>
                                        {selectedBlog.category}
                                    </span>
                                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 500, color: '#1a2b15', lineHeight: 1.2 }}>
                                        {selectedBlog.title}
                                    </h1>
                                </div>
                                <button onClick={() => setSelectedBlog(null)} style={{
                                    background: '#f4f4f4', border: 'none', borderRadius: '8px',
                                    padding: '10px 16px', cursor: 'pointer', fontFamily: 'Jost, sans-serif',
                                    fontSize: '14px', fontWeight: 600, color: '#666',
                                }}>
                                    ✕ Close
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#888' }}>
                                <span>By {selectedBlog.author}</span>
                                <span>·</span>
                                <span>{selectedBlog.readTime} min read</span>
                                {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                                    <>
                                        <span>·</span>
                                        {selectedBlog.tags.map(tag => (
                                            <span key={tag} style={{
                                                background: '#f4f4f4', padding: '2px 8px',
                                                borderRadius: '4px', fontSize: '12px',
                                            }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </>
                                )}
                            </div>

                            <div
                                style={{
                                    fontFamily: 'Jost, sans-serif', fontSize: '16px', color: '#333',
                                    lineHeight: 1.8, borderTop: '1px solid #f0f0f0', paddingTop: '28px',
                                }}
                                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Jost:wght@300;400;500;600&display=swap');
            `}</style>
        </>
    );
}
