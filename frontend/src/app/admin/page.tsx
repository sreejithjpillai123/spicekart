'use client';

import { useState, useEffect } from 'react';
import { adminLogin, createProduct, getAdminProducts, Product } from '../lib/api';
import Image from 'next/image';

export default function AdminDashboard() {
    const [token, setToken] = useState<string | null>(null);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: 'Cardamom',
        badge: '',
        stock: '100',
        images: '',
        featured: false,
        isActive: true,
        gradeColor: '#4a6741',
        gradeAccent: '#90c870'
    });
    const [formMsg, setFormMsg] = useState('');

    useEffect(() => {
        const savedToken = localStorage.getItem('adminToken');
        if (savedToken) {
            setToken(savedToken);
            loadProducts(savedToken);
        }
    }, []);

    const loadProducts = async (authToken: string) => {
        try {
            const data = await getAdminProducts(authToken);
            setProducts(data);
        } catch (err: any) {
            if (err.message.includes('authorized') || err.message.includes('token')) {
                handleLogout();
            }
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        try {
            const res = await adminLogin(loginEmail, loginPassword);
            localStorage.setItem('adminToken', res.token);
            setToken(res.token);
            loadProducts(res.token);
        } catch (err: any) {
            setLoginError(err.message || 'Login failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
        setProducts([]);
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setLoading(true);
        setFormMsg('');

        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
                stock: Number(formData.stock),
                images: formData.images.split(',').map(i => i.trim()).filter(Boolean),
                badge: formData.badge || null,
            };

            await createProduct(token, payload);
            setFormMsg('Product created successfully!');
            setFormData({
                name: '',
                description: '',
                price: '',
                originalPrice: '',
                category: 'Cardamom',
                badge: '',
                stock: '100',
                images: '',
                featured: false,
                isActive: true,
                gradeColor: '#4a6741',
                gradeAccent: '#90c870'
            });
            loadProducts(token);
        } catch (err: any) {
            setFormMsg(err.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf8f4' }}>
                <div style={{ background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', textAlign: 'center', marginBottom: '24px', color: '#4a6741' }}>Admin Login</h2>
                    {loginError && <p style={{ color: 'red', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{loginError}</p>}
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={loginEmail}
                            onChange={e => setLoginEmail(e.target.value)}
                            required
                            style={{ padding: '12px', border: '1px solid #e0e0e0', borderRadius: '4px', fontFamily: 'Jost, sans-serif' }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={e => setLoginPassword(e.target.value)}
                            required
                            style={{ padding: '12px', border: '1px solid #e0e0e0', borderRadius: '4px', fontFamily: 'Jost, sans-serif' }}
                        />
                        <button type="submit" style={{ padding: '14px', background: '#4a6741', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Login</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#faf8f4', padding: '40px 20px', fontFamily: 'Jost, sans-serif' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#2c2c2c', fontSize: '32px' }}>SpiceKart Admin</h1>
                    <button onClick={handleLogout} style={{ padding: '8px 16px', border: '1px solid #2c2c2c', borderRadius: '4px', background: 'transparent', cursor: 'pointer' }}>Logout</button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                    {/* Create Product Form */}
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#4a6741' }}>Add New Product</h2>
                        {formMsg && <p style={{ marginBottom: '16px', padding: '10px', background: formMsg.includes('success') ? '#e8f5ea' : '#fdeaea', color: formMsg.includes('success') ? '#2d6a28' : '#c03030', borderRadius: '4px' }}>{formMsg}</p>}

                        <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 600 }}>Name *</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 600 }}>Description *</label>
                                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', minHeight: '80px' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 600 }}>Price (₹) *</label>
                                    <input type="number" required min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 600 }}>Original Price (₹)</label>
                                    <input type="number" min="0" value={formData.originalPrice} onChange={e => setFormData({ ...formData, originalPrice: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 600 }}>Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                                        <option value="Cardamom">Cardamom</option>
                                        <option value="Pepper">Pepper</option>
                                        <option value="Pepper Powder">Pepper Powder</option>
                                        <option value="Cloves">Cloves</option>
                                        <option value="Vanilla">Vanilla</option>
                                        <option value="Turmeric">Turmeric</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 600 }}>Stock</label>
                                    <input type="number" min="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 600 }}>Badge</label>
                                <select value={formData.badge} onChange={e => setFormData({ ...formData, badge: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                                    <option value="">None</option>
                                    <option value="NEW">NEW</option>
                                    <option value="SALE">SALE</option>
                                    <option value="BEST SELLER">BEST SELLER</option>
                                    <option value="SOLD OUT">SOLD OUT</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 600 }}>Image URLs (comma separated)</label>
                                <input type="text" placeholder="https://example.com/img1.png, ..." value={formData.images} onChange={e => setFormData({ ...formData, images: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }} />
                            </div>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                <input type="checkbox" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} />
                                Featured on Home Page
                            </label>

                            <button type="submit" disabled={loading} style={{ padding: '14px', background: '#4a6741', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, marginTop: '8px' }}>
                                {loading ? 'Saving...' : 'Create Product'}
                            </button>
                        </form>
                    </div>

                    {/* Product List */}
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#2c2c2c' }}>All Products ({products.length})</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {products.length === 0 ? (
                                <p style={{ color: '#8a8a8a', fontSize: '14px' }}>No products found.</p>
                            ) : (
                                products.map(p => (
                                    <div key={p._id} style={{ display: 'flex', gap: '16px', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
                                        <div style={{ width: '60px', height: '60px', background: '#f5f5f5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {p.images && p.images.length > 0 ? (
                                                <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontSize: '24px' }}>🌿</span>
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '16px', margin: '0 0 4px', color: '#2c2c2c' }}>{p.name}</h3>
                                            <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#6a6a6a' }}>
                                                <span>₹{p.price}</span>
                                                <span>•</span>
                                                <span>{p.category}</span>
                                                {p.badge && (
                                                    <>
                                                        <span>•</span>
                                                        <span style={{ color: '#4a6741', fontWeight: 600 }}>{p.badge}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
