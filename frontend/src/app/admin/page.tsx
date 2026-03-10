'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    adminLogin, createProduct, getAdminProducts, updateProduct, deleteProduct,
    createBlog, getAdminBlogs, updateBlog, deleteBlog,
    getShopSettings, updateShopSettings, getGradingSection,
    adminGetGradeCollections, adminUpdateGradeCollection,
    type Product, type Blog, type ShopSettings, type GradingGrade, type GradeCollectionData, type GradeFeature, type GradeWeightPrice,
} from '../lib/api';


// ─── Types ─────────────────────────────────────────────────────────────────
type Tab = 'products' | 'shop' | 'blogs' | 'grading' | 'collections';

const defaultProductForm = {
    name: '', description: '', price: '', originalPrice: '',
    category: 'Cardamom', badge: '', stock: '100', images: '',
    featured: false, isActive: true, gradeColor: '#4a6741', gradeAccent: '#90c870',
};

const defaultBlogForm = {
    title: '', excerpt: '', content: '', coverImage: '',
    author: 'SpiceKart Team', category: 'Spice Guide', tags: '',
    published: false, featured: false, readTime: '5',
};

const defaultShopForm: Partial<ShopSettings> = {
    heroBannerTitle: "World's Best Cardamom",
    heroBannerSubtitle: 'Premium spices from Kerala',
    sectionEyebrow: 'Our Collection',
    sectionTitle: 'Premium Spice Range',
    sectionBody: 'Handpicked, sun-dried and carefully packaged to preserve every note of flavour and aroma.',
    featuredEnabled: true,
};

// ─── Styles ────────────────────────────────────────────────────────────────
const S = {
    page: { minHeight: '100vh', background: '#f4f6f0', fontFamily: 'Jost, sans-serif' } as React.CSSProperties,
    sidebar: {
        position: 'fixed' as const, left: 0, top: 0, bottom: 0, width: '220px',
        background: 'linear-gradient(180deg, #1a2b15 0%, #2a4020 100%)',
        display: 'flex', flexDirection: 'column' as const, padding: '0',
        zIndex: 100, boxShadow: '4px 0 20px rgba(0,0,0,0.18)',
    },
    sidebarLogo: {
        padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)',
        fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#c8a96e',
        letterSpacing: '0.5px', lineHeight: 1.2,
    },
    nav: { padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column' as const, gap: '4px' },
    navItem: (active: boolean) => ({
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '11px 16px', borderRadius: '8px', cursor: 'pointer',
        background: active ? 'rgba(200,169,110,0.18)' : 'transparent',
        color: active ? '#c8a96e' : 'rgba(255,255,255,0.6)',
        fontWeight: active ? 600 : 400, fontSize: '14px',
        border: active ? '1px solid rgba(200,169,110,0.25)' : '1px solid transparent',
        transition: 'all 0.2s ease',
    }),
    main: { marginLeft: '220px', padding: '0 36px 60px', minHeight: '100vh' },
    topbar: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '24px 0 20px', borderBottom: '1px solid #e0e5d8', marginBottom: '32px',
    },
    pageTitle: { fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#1a2b15', fontWeight: 500 },
    card: {
        background: '#ffffff', borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '28px',
        border: '1px solid rgba(0,0,0,0.04)',
    },
    label: { display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#4a5a40', letterSpacing: '0.5px', textTransform: 'uppercase' as const },
    input: {
        width: '100%', padding: '10px 14px', border: '1px solid #d8e0d0',
        borderRadius: '8px', fontFamily: 'Jost, sans-serif', fontSize: '14px',
        color: '#2c2c2c', background: '#fafcf8', outline: 'none',
        boxSizing: 'border-box' as const, transition: 'border-color 0.2s',
    },
    textarea: {
        width: '100%', padding: '10px 14px', border: '1px solid #d8e0d0',
        borderRadius: '8px', fontFamily: 'Jost, sans-serif', fontSize: '14px',
        color: '#2c2c2c', background: '#fafcf8', outline: 'none', resize: 'vertical' as const,
        boxSizing: 'border-box' as const, minHeight: '100px',
    },
    select: {
        width: '100%', padding: '10px 14px', border: '1px solid #d8e0d0',
        borderRadius: '8px', fontFamily: 'Jost, sans-serif', fontSize: '14px',
        color: '#2c2c2c', background: '#fafcf8', outline: 'none',
        boxSizing: 'border-box' as const,
    },
    btn: (variant: 'primary' | 'danger' | 'secondary' | 'ghost') => ({
        padding: '9px 18px', borderRadius: '7px', border: 'none', cursor: 'pointer',
        fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 600,
        letterSpacing: '0.3px', transition: 'all 0.2s ease',
        background: variant === 'primary' ? '#4a6741' : variant === 'danger' ? '#c03030' : variant === 'secondary' ? '#e8f0e0' : 'transparent',
        color: variant === 'primary' ? '#fff' : variant === 'danger' ? '#fff' : variant === 'secondary' ? '#4a6741' : '#888',
    }),
    badge: (type: string) => ({
        display: 'inline-block', padding: '2px 10px', borderRadius: '20px',
        fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
        background: type === 'published' ? '#e8f5e8' : type === 'draft' ? '#fff3e0' : type === 'active' ? '#e8f0ff' : '#f5f5f5',
        color: type === 'published' ? '#2e7d32' : type === 'draft' ? '#e65100' : type === 'active' ? '#1565c0' : '#666',
    }),
    alert: (type: 'success' | 'error') => ({
        padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px',
        background: type === 'success' ? '#e8f5ea' : '#fdeaea',
        color: type === 'success' ? '#2d6a28' : '#c03030',
        border: `1px solid ${type === 'success' ? '#b0d8b0' : '#f0b0b0'}`,
    }),
};

// ─── Helper: Grid ────────────────────────────────────────────────────────
function Grid({ cols, gap, children }: { cols: string; gap?: string; children: React.ReactNode }) {
    return <div style={{ display: 'grid', gridTemplateColumns: cols, gap: gap || '16px' }}>{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label style={S.label}>{label}</label>
            {children}
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────
export default function AdminDashboard() {
    const [token, setToken] = useState<string | null>(null);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [activeTab, setActiveTab] = useState<Tab>('products');

    // Products state
    const [products, setProducts] = useState<Product[]>([]);
    const [prodLoading, setProdLoading] = useState(false);
    const [prodMsg, setProdMsg] = useState('');
    const [prodMsgType, setProdMsgType] = useState<'success' | 'error'>('success');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showProdForm, setShowProdForm] = useState(false);
    const [productForm, setProductForm] = useState({ ...defaultProductForm });
    const [deletingProdId, setDeletingProdId] = useState<string | null>(null);

    // Blog state
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [blogLoading, setBlogLoading] = useState(false);
    const [blogMsg, setBlogMsg] = useState('');
    const [blogMsgType, setBlogMsgType] = useState<'success' | 'error'>('success');
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [showBlogForm, setShowBlogForm] = useState(false);
    const [blogForm, setBlogForm] = useState({ ...defaultBlogForm });
    const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);

    // Shop Settings state
    const [shopForm, setShopForm] = useState<Partial<ShopSettings>>(defaultShopForm);
    const [shopLoading, setShopLoading] = useState(false);
    const [shopMsg, setShopMsg] = useState('');
    const [shopMsgType, setShopMsgType] = useState<'success' | 'error'>('success');

    // Grading Section state
    const defaultGrades: GradingGrade[] = [
        { label: 'Purple Grade', img: 'https://www.emperorakbar.com/cdn/shop/files/EAC_Website_MISC-07_869af3c3-d169-449d-a9dc-1db16cf3e7a4_1080x.png?v=1625644495', imgH: 90 },
        { label: 'Pink Grade', img: 'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-14.png?v=1625572139', imgH: 80 },
        { label: 'Green Grade', img: 'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-15.png?v=1625572246', imgH: 72 },
        { label: 'Orange Grade', img: 'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-16.png?v=1625572290', imgH: 64 },
        { label: 'Red Grade', img: 'https://cdn.shopify.com/s/files/1/0581/5926/8038/files/EAC_Website_MISC-17.png?v=1625572334', imgH: 56 },
    ];
    const [gradingTitle, setGradingTitle] = useState('Graded to your Requirement');
    const [gradingBody, setGradingBody] = useState("'One size doesn't fit all' is true in the case of cardamom as well. Because of their multiple uses and benefits, cardamom pods of different sizes are used in different applications. That is why Emperor Akbar Cardamom is graded by size. However, the grading is never about quality. Whatever the size, quality remains world class.");
    const [gradingGrades, setGradingGrades] = useState<GradingGrade[]>(defaultGrades);
    const [gradingLoading, setGradingLoading] = useState(false);
    const [gradingMsg, setGradingMsg] = useState('');
    const [gradingMsgType, setGradingMsgType] = useState<'success' | 'error'>('success');

    // Collections tab state
    const [collections, setCollections] = useState<GradeCollectionData[]>([]);
    const [editingCollSlug, setEditingCollSlug] = useState<string | null>(null);
    const [collForm, setCollForm] = useState<Partial<GradeCollectionData>>({});
    const [collLoading, setCollLoading] = useState(false);
    const [collMsg, setCollMsg] = useState('');
    const [collMsgType, setCollMsgType] = useState<'success' | 'error'>('success');

    // ─── On mount / Login ───────────────────────────────────────────────
    useEffect(() => {
        const savedToken = localStorage.getItem('adminToken');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    useEffect(() => {
        if (!token) return;
        loadProducts(token);
        loadBlogs(token);
        loadShopSettings();
        loadGradingSection();
        loadCollections(token);
    }, [token]);

    // ─── Loaders ────────────────────────────────────────────────────────
    const loadProducts = async (authToken: string) => {
        try {
            const data = await getAdminProducts(authToken);
            setProducts(data);
        } catch (err: any) {
            if (err.message?.includes('authorized') || err.message?.includes('token')) handleLogout();
        }
    };

    const loadBlogs = async (authToken: string) => {
        try {
            const data = await getAdminBlogs(authToken);
            setBlogs(data);
        } catch { }
    };

    const loadShopSettings = async () => {
        try {
            const data = await getShopSettings();
            setShopForm({
                heroBannerTitle: data.heroBannerTitle,
                heroBannerSubtitle: data.heroBannerSubtitle,
                sectionEyebrow: data.sectionEyebrow,
                sectionTitle: data.sectionTitle,
                sectionBody: data.sectionBody,
                featuredEnabled: data.featuredEnabled,
            });
        } catch { }
    };

    const loadGradingSection = async () => {
        try {
            const data = await getGradingSection();
            if (data.title) setGradingTitle(data.title);
            if (data.body) setGradingBody(data.body);
            if (data.grades && data.grades.length > 0) setGradingGrades(data.grades);
        } catch { }
    };

    const loadCollections = async (authToken: string) => {
        try {
            const data = await adminGetGradeCollections(authToken);
            setCollections(data);
        } catch { }
    };

    // ─── Auth ────────────────────────────────────────────────────────────
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        try {
            const res = await adminLogin(loginEmail, loginPassword);
            localStorage.setItem('adminToken', res.token);
            setToken(res.token);
        } catch (err: any) {
            setLoginError(err.message || 'Login failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
        setProducts([]);
        setBlogs([]);
    };

    // ─── Product CRUD ───────────────────────────────────────────────────
    const openAddProduct = () => {
        setEditingProduct(null);
        setProductForm({ ...defaultProductForm });
        setShowProdForm(true);
        setProdMsg('');
    };

    const openEditProduct = (p: Product) => {
        setEditingProduct(p);
        setProductForm({
            name: p.name, description: p.description, price: String(p.price),
            originalPrice: p.originalPrice ? String(p.originalPrice) : '',
            category: p.category, badge: p.badge || '', stock: String(p.stock),
            images: p.images?.join(', ') || '', featured: p.featured,
            isActive: p.isActive, gradeColor: p.gradeColor || '#4a6741',
            gradeAccent: p.gradeAccent || '#90c870',
        });
        setShowProdForm(true);
        setProdMsg('');
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setProdLoading(true);
        setProdMsg('');
        try {
            const payload = {
                ...productForm,
                price: Number(productForm.price),
                originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
                stock: Number(productForm.stock),
                images: productForm.images.split(',').map(i => i.trim()).filter(Boolean),
                badge: productForm.badge || null,
            };
            if (editingProduct) {
                await updateProduct(token, editingProduct._id, payload);
                setProdMsg('Product updated successfully!');
            } else {
                await createProduct(token, payload);
                setProdMsg('Product created successfully!');
            }
            setProdMsgType('success');
            setShowProdForm(false);
            setEditingProduct(null);
            loadProducts(token);
        } catch (err: any) {
            setProdMsg(err.message || 'Failed to save product');
            setProdMsgType('error');
        } finally {
            setProdLoading(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!token || !window.confirm('Delete this product?')) return;
        setDeletingProdId(id);
        try {
            await deleteProduct(token, id);
            setProdMsg('Product deleted.');
            setProdMsgType('success');
            loadProducts(token);
        } catch (err: any) {
            setProdMsg(err.message || 'Failed to delete');
            setProdMsgType('error');
        } finally {
            setDeletingProdId(null);
        }
    };

    // ─── Blog CRUD ───────────────────────────────────────────────────────
    const openAddBlog = () => {
        setEditingBlog(null);
        setBlogForm({ ...defaultBlogForm });
        setShowBlogForm(true);
        setBlogMsg('');
    };

    const openEditBlog = (b: Blog) => {
        setEditingBlog(b);
        setBlogForm({
            title: b.title, excerpt: b.excerpt, content: b.content,
            coverImage: b.coverImage || '', author: b.author,
            category: b.category, tags: b.tags?.join(', ') || '',
            published: b.published, featured: b.featured,
            readTime: String(b.readTime),
        });
        setShowBlogForm(true);
        setBlogMsg('');
    };

    const handleBlogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setBlogLoading(true);
        setBlogMsg('');
        try {
            const payload = {
                ...blogForm,
                readTime: Number(blogForm.readTime),
                tags: blogForm.tags.split(',').map(t => t.trim()).filter(Boolean),
            };
            if (editingBlog) {
                await updateBlog(token, editingBlog._id, payload);
                setBlogMsg('Blog updated successfully!');
            } else {
                await createBlog(token, payload);
                setBlogMsg('Blog created successfully!');
            }
            setBlogMsgType('success');
            setShowBlogForm(false);
            setEditingBlog(null);
            loadBlogs(token);
        } catch (err: any) {
            setBlogMsg(err.message || 'Failed to save blog');
            setBlogMsgType('error');
        } finally {
            setBlogLoading(false);
        }
    };

    const handleDeleteBlog = async (id: string) => {
        if (!token || !window.confirm('Delete this blog post?')) return;
        setDeletingBlogId(id);
        try {
            await deleteBlog(token, id);
            setBlogMsg('Blog deleted.');
            setBlogMsgType('success');
            loadBlogs(token);
        } catch (err: any) {
            setBlogMsg(err.message || 'Failed to delete');
            setBlogMsgType('error');
        } finally {
            setDeletingBlogId(null);
        }
    };

    // ─── Shop Settings ───────────────────────────────────────────────────
    const handleShopSettingsSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setShopLoading(true);
        setShopMsg('');
        try {
            await updateShopSettings(token, shopForm);
            setShopMsg('Shop settings saved successfully!');
            setShopMsgType('success');
        } catch (err: any) {
            setShopMsg(err.message || 'Failed to save settings');
            setShopMsgType('error');
        } finally {
            setShopLoading(false);
        }
    };

    const handleGradingSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setGradingLoading(true);
        setGradingMsg('');
        try {
            await updateShopSettings(token, {
                gradingTitle,
                gradingBody,
                gradingGrades,
            });
            setGradingMsg('Grading section saved successfully!');
            setGradingMsgType('success');
        } catch (err: any) {
            setGradingMsg(err.message || 'Failed to save grading section');
            setGradingMsgType('error');
        } finally {
            setGradingLoading(false);
        }
    };

    const updateGrade = (index: number, field: keyof GradingGrade, value: string | number) => {
        setGradingGrades(prev => prev.map((g, i) => i === index ? { ...g, [field]: value } : g));
    };

    // ─── Collections Handlers ────────────────────────────────────────────
    const openEditCollection = (c: GradeCollectionData) => {
        setEditingCollSlug(c.slug);
        setCollForm({
            ...c,
            images: c.images,
            weights: c.weights,
            features: c.features,
        });
        setCollMsg('');
    };

    const handleCollSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !editingCollSlug) return;
        setCollLoading(true);
        setCollMsg('');
        try {
            const updated = await adminUpdateGradeCollection(token, editingCollSlug, collForm);
            setCollections(prev => prev.map(c => c.slug === editingCollSlug ? updated : c));
            setCollMsg('Collection page saved successfully!');
            setCollMsgType('success');
        } catch (err: any) {
            setCollMsg(err.message || 'Failed to save');
            setCollMsgType('error');
        } finally {
            setCollLoading(false);
        }
    };

    const updateCollImages = (raw: string) => {
        setCollForm(prev => ({ ...prev, images: raw.split(',').map(s => s.trim()).filter(Boolean) }));
    };

    const updateWeightObj = (idx: number, field: keyof GradeWeightPrice, val: string | number) => {
        setCollForm(prev => ({
            ...prev,
            weights: (prev.weights || []).map((w, i) => i === idx ? { ...w, [field]: val } : w),
        }));
    };

    const addCollWeight = () => {
        setCollForm(prev => ({ ...prev, weights: [...(prev.weights || []), { weight: '100 gm', price: 0, originalPrice: 0 }] }));
    };

    const removeCollWeight = (idx: number) => {
        setCollForm(prev => ({ ...prev, weights: (prev.weights || []).filter((_, i) => i !== idx) }));
    };

    const updateFeature = (idx: number, field: keyof GradeFeature, val: string) => {
        setCollForm(prev => ({
            ...prev,
            features: (prev.features || []).map((f, i) => i === idx ? { ...f, [field]: val } : f),
        }));
    };

    // ─── Login Screen ─────────────────────────────────────────────────────
    if (!token) {
        return (
            <div style={{
                minHeight: '100vh', background: 'linear-gradient(135deg, #1a2b15 0%, #2a4020 50%, #1a2b15 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <div style={{
                    background: '#fff', padding: '48px 40px', borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: '420px',
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌿</div>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', color: '#1a2b15', margin: 0 }}>
                            SpiceKart Admin
                        </h2>
                        <p style={{ color: '#888', fontSize: '14px', marginTop: '6px', fontFamily: 'Jost, sans-serif' }}>
                            Sign in to manage your store
                        </p>
                    </div>
                    {loginError && (
                        <div style={S.alert('error')}>{loginError}</div>
                    )}
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Field label="Email">
                            <input type="email" required value={loginEmail}
                                onChange={e => setLoginEmail(e.target.value)} style={S.input} placeholder="admin@spicekart.com" />
                        </Field>
                        <Field label="Password">
                            <input type="password" required value={loginPassword}
                                onChange={e => setLoginPassword(e.target.value)} style={S.input} placeholder="••••••••" />
                        </Field>
                        <button type="submit" style={{
                            ...S.btn('primary'), padding: '14px', width: '100%',
                            fontSize: '14px', marginTop: '8px', borderRadius: '10px',
                        }}>
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const navItems: { key: Tab; label: string; icon: string }[] = [
        { key: 'products', label: 'Products', icon: '📦' },
        { key: 'shop', label: 'Shop Settings', icon: '🏪' },
        { key: 'blogs', label: 'Blog Posts', icon: '📝' },
        { key: 'grading', label: 'Grading Section', icon: '🌿' },
        { key: 'collections', label: 'Page Collections', icon: '🗂️' },
    ];

    return (
        <div style={S.page}>
            {/* ─── Sidebar ─── */}
            <aside style={S.sidebar}>
                <div style={S.sidebarLogo}>
                    🌿 SpiceKart<br />
                    <span style={{ fontSize: '12px', color: 'rgba(200,169,110,0.6)', fontFamily: 'Jost, sans-serif', letterSpacing: '2px' }}>
                        ADMIN PANEL
                    </span>
                </div>
                <nav style={S.nav}>
                    {navItems.map(item => (
                        <button key={item.key} onClick={() => setActiveTab(item.key)}
                            style={S.navItem(activeTab === item.key)}>
                            <span>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <button onClick={handleLogout} style={{
                        width: '100%', padding: '10px', borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.15)', background: 'transparent',
                        color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Jost, sans-serif',
                        fontSize: '13px', transition: 'all 0.2s',
                    }}>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ─── Main ─── */}
            <main style={S.main}>
                {/* ─── PRODUCTS TAB ─── */}
                {activeTab === 'products' && (
                    <div>
                        <div style={S.topbar}>
                            <h1 style={S.pageTitle}>Products</h1>
                            <button onClick={openAddProduct} style={S.btn('primary')}>
                                + Add Product
                            </button>
                        </div>

                        {prodMsg && !showProdForm && (
                            <div style={S.alert(prodMsgType)}>{prodMsg}</div>
                        )}

                        {/* Product Form Modal */}
                        {showProdForm && (
                            <div style={{
                                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                                zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '20px',
                            }}>
                                <div style={{
                                    background: '#fff', borderRadius: '16px', padding: '36px',
                                    width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: '#1a2b15', margin: 0 }}>
                                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                                        </h2>
                                        <button onClick={() => setShowProdForm(false)} style={S.btn('ghost')}>✕</button>
                                    </div>

                                    {prodMsg && <div style={S.alert(prodMsgType)}>{prodMsg}</div>}

                                    <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        <Field label="Product Name *">
                                            <input type="text" required value={productForm.name}
                                                onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                                                style={S.input} />
                                        </Field>
                                        <Field label="Description *">
                                            <textarea required value={productForm.description}
                                                onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                                                style={S.textarea} />
                                        </Field>
                                        <Grid cols="1fr 1fr">
                                            <Field label="Price (₹) *">
                                                <input type="number" required min="0" value={productForm.price}
                                                    onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                                                    style={S.input} />
                                            </Field>
                                            <Field label="Original Price (₹)">
                                                <input type="number" min="0" value={productForm.originalPrice}
                                                    onChange={e => setProductForm({ ...productForm, originalPrice: e.target.value })}
                                                    style={S.input} />
                                            </Field>
                                        </Grid>
                                        <Grid cols="1fr 1fr">
                                            <Field label="Category">
                                                <select value={productForm.category}
                                                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                                                    style={S.select}>
                                                    {['Cardamom', 'Pepper', 'Pepper Powder', 'Cloves', 'Vanilla', 'Turmeric'].map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </Field>
                                            <Field label="Stock">
                                                <input type="number" min="0" value={productForm.stock}
                                                    onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                                                    style={S.input} />
                                            </Field>
                                        </Grid>
                                        <Field label="Badge">
                                            <select value={productForm.badge}
                                                onChange={e => setProductForm({ ...productForm, badge: e.target.value })}
                                                style={S.select}>
                                                {['', 'NEW', 'SALE', 'BEST SELLER', 'SOLD OUT'].map(b => (
                                                    <option key={b} value={b}>{b || 'None'}</option>
                                                ))}
                                            </select>
                                        </Field>
                                        <Field label="Image URLs (comma-separated)">
                                            <input type="text" placeholder="https://example.com/img1.jpg, ..."
                                                value={productForm.images}
                                                onChange={e => setProductForm({ ...productForm, images: e.target.value })}
                                                style={S.input} />
                                        </Field>
                                        <Grid cols="1fr 1fr">
                                            <Field label="Grade Color">
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <input type="color" value={productForm.gradeColor}
                                                        onChange={e => setProductForm({ ...productForm, gradeColor: e.target.value })}
                                                        style={{ width: '48px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} />
                                                    <input type="text" value={productForm.gradeColor}
                                                        onChange={e => setProductForm({ ...productForm, gradeColor: e.target.value })}
                                                        style={{ ...S.input, flex: 1 }} />
                                                </div>
                                            </Field>
                                            <Field label="Grade Accent">
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <input type="color" value={productForm.gradeAccent}
                                                        onChange={e => setProductForm({ ...productForm, gradeAccent: e.target.value })}
                                                        style={{ width: '48px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} />
                                                    <input type="text" value={productForm.gradeAccent}
                                                        onChange={e => setProductForm({ ...productForm, gradeAccent: e.target.value })}
                                                        style={{ ...S.input, flex: 1 }} />
                                                </div>
                                            </Field>
                                        </Grid>
                                        <div style={{ display: 'flex', gap: '20px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={productForm.featured}
                                                    onChange={e => setProductForm({ ...productForm, featured: e.target.checked })} />
                                                Featured on Home Page
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={productForm.isActive}
                                                    onChange={e => setProductForm({ ...productForm, isActive: e.target.checked })} />
                                                Active (Visible in Shop)
                                            </label>
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                                            <button type="button" onClick={() => setShowProdForm(false)} style={S.btn('secondary')}>
                                                Cancel
                                            </button>
                                            <button type="submit" disabled={prodLoading} style={S.btn('primary')}>
                                                {prodLoading ? 'Saving…' : editingProduct ? 'Update Product' : 'Create Product'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Products Table */}
                        <div style={S.card}>
                            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#1a2b15', margin: 0 }}>
                                    All Products ({products.length})
                                </h2>
                            </div>
                            {products.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>
                                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
                                    <p>No products yet. Add your first product!</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                    {/* Table Header */}
                                    <div style={{
                                        display: 'grid', gridTemplateColumns: '60px 1fr 120px 80px 100px 120px',
                                        gap: '12px', padding: '10px 16px',
                                        background: '#f4f6f0', borderRadius: '8px 8px 0 0',
                                        fontSize: '11px', fontWeight: 700, color: '#4a5a40',
                                        letterSpacing: '0.8px', textTransform: 'uppercase',
                                        borderBottom: '1px solid #e8ede0',
                                    }}>
                                        <span>Image</span>
                                        <span>Name</span>
                                        <span>Category</span>
                                        <span>Price</span>
                                        <span>Status</span>
                                        <span>Actions</span>
                                    </div>
                                    {products.map((p, idx) => (
                                        <div key={p._id} style={{
                                            display: 'grid', gridTemplateColumns: '60px 1fr 120px 80px 100px 120px',
                                            gap: '12px', padding: '14px 16px',
                                            borderBottom: idx < products.length - 1 ? '1px solid #f0f4ec' : 'none',
                                            alignItems: 'center', transition: 'background 0.15s',
                                        }}
                                            onMouseEnter={e => (e.currentTarget.style.background = '#fafcf8')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                        >
                                            <div style={{
                                                width: '48px', height: '48px', borderRadius: '8px',
                                                background: `linear-gradient(135deg, ${p.gradeColor || '#4a6741'}22, ${p.gradeAccent || '#90c870'}44)`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)',
                                            }}>
                                                {p.images && p.images.length > 0 ? (
                                                    <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <span style={{ fontSize: '18px' }}>🌿</span>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '14px', color: '#1a2b15' }}>{p.name}</div>
                                                {p.badge && <span style={S.badge('active')}>{p.badge}</span>}
                                            </div>
                                            <span style={{ fontSize: '13px', color: '#666' }}>{p.category}</span>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#2c2c2c' }}>₹{p.price.toLocaleString('en-IN')}</span>
                                            <span style={S.badge(p.isActive ? 'published' : 'draft')}>
                                                {p.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => openEditProduct(p)}
                                                    style={{ ...S.btn('secondary'), padding: '6px 12px', fontSize: '12px' }}>
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDeleteProduct(p._id)}
                                                    disabled={deletingProdId === p._id}
                                                    style={{ ...S.btn('danger'), padding: '6px 12px', fontSize: '12px', opacity: deletingProdId === p._id ? 0.5 : 1 }}>
                                                    {deletingProdId === p._id ? '…' : 'Del'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── SHOP SETTINGS TAB ─── */}
                {activeTab === 'shop' && (
                    <div>
                        <div style={S.topbar}>
                            <h1 style={S.pageTitle}>Shop Page Settings</h1>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                            <form onSubmit={handleShopSettingsSave} style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#1a2b15', margin: '0 0 4px' }}>
                                    Hero Banner
                                </h2>

                                {shopMsg && <div style={S.alert(shopMsgType)}>{shopMsg}</div>}

                                <Field label="Banner Title">
                                    <input type="text" value={shopForm.heroBannerTitle || ''}
                                        onChange={e => setShopForm({ ...shopForm, heroBannerTitle: e.target.value })}
                                        style={S.input} />
                                </Field>
                                <Field label="Banner Subtitle">
                                    <input type="text" value={shopForm.heroBannerSubtitle || ''}
                                        onChange={e => setShopForm({ ...shopForm, heroBannerSubtitle: e.target.value })}
                                        style={S.input} />
                                </Field>

                                <hr style={{ border: 'none', borderTop: '1px solid #e8ede0', margin: '4px 0' }} />
                                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#1a2b15', margin: '0 0 4px' }}>
                                    Products Section
                                </h2>

                                <Field label="Section Eyebrow (small text above title)">
                                    <input type="text" value={shopForm.sectionEyebrow || ''}
                                        onChange={e => setShopForm({ ...shopForm, sectionEyebrow: e.target.value })}
                                        style={S.input} />
                                </Field>
                                <Field label="Section Title">
                                    <input type="text" value={shopForm.sectionTitle || ''}
                                        onChange={e => setShopForm({ ...shopForm, sectionTitle: e.target.value })}
                                        style={S.input} />
                                </Field>
                                <Field label="Section Body Text">
                                    <textarea value={shopForm.sectionBody || ''}
                                        onChange={e => setShopForm({ ...shopForm, sectionBody: e.target.value })}
                                        style={{ ...S.textarea, minHeight: '80px' }} />
                                </Field>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={shopForm.featuredEnabled ?? true}
                                        onChange={e => setShopForm({ ...shopForm, featuredEnabled: e.target.checked })} />
                                    Show Featured Products Section on Home Page
                                </label>

                                <button type="submit" disabled={shopLoading} style={{ ...S.btn('primary'), padding: '12px 28px', alignSelf: 'flex-start' }}>
                                    {shopLoading ? 'Saving…' : '💾 Save Shop Settings'}
                                </button>
                            </form>

                            {/* Live Preview */}
                            <div style={{ ...S.card, background: '#1e2218', color: '#fff' }}>
                                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#c8a96e', marginBottom: '20px' }}>
                                    🖥 Live Preview
                                </h3>
                                <div style={{ background: '#2a3520', borderRadius: '10px', padding: '24px', marginBottom: '16px' }}>
                                    <p style={{ fontFamily: 'Jost', fontSize: '11px', letterSpacing: '3px', color: '#c8a96e', marginBottom: '10px', textTransform: 'uppercase' }}>
                                        Shop Page Hero
                                    </p>
                                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#fff', margin: '0 0 8px' }}>
                                        {shopForm.heroBannerTitle || "World's Best Cardamom"}
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontFamily: 'Jost' }}>
                                        {shopForm.heroBannerSubtitle || 'Premium spices from Kerala'}
                                    </p>
                                </div>
                                <div style={{ background: '#2a3520', borderRadius: '10px', padding: '24px' }}>
                                    <p style={{ fontFamily: 'Jost', fontSize: '11px', letterSpacing: '3px', color: '#c8a96e', textTransform: 'uppercase', marginBottom: '8px' }}>
                                        {shopForm.sectionEyebrow || 'Our Collection'}
                                    </p>
                                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: '#fff', margin: '0 0 10px' }}>
                                        {shopForm.sectionTitle || 'Premium Spice Range'}
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontFamily: 'Jost', lineHeight: 1.6 }}>
                                        {shopForm.sectionBody || 'Handpicked, sun-dried and carefully packaged.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── BLOGS TAB ─── */}
                {activeTab === 'blogs' && (
                    <div>
                        <div style={S.topbar}>
                            <h1 style={S.pageTitle}>Blog Posts</h1>
                            <button onClick={openAddBlog} style={S.btn('primary')}>
                                + New Blog Post
                            </button>
                        </div>

                        {blogMsg && !showBlogForm && (
                            <div style={S.alert(blogMsgType)}>{blogMsg}</div>
                        )}

                        {/* Blog Form Modal */}
                        {showBlogForm && (
                            <div style={{
                                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                                zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '20px',
                            }}>
                                <div style={{
                                    background: '#fff', borderRadius: '16px', padding: '36px',
                                    width: '100%', maxWidth: '780px', maxHeight: '92vh', overflowY: 'auto',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: '#1a2b15', margin: 0 }}>
                                            {editingBlog ? 'Edit Blog Post' : 'New Blog Post'}
                                        </h2>
                                        <button onClick={() => setShowBlogForm(false)} style={S.btn('ghost')}>✕</button>
                                    </div>

                                    {blogMsg && <div style={S.alert(blogMsgType)}>{blogMsg}</div>}

                                    <form onSubmit={handleBlogSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        <Field label="Title *">
                                            <input type="text" required value={blogForm.title}
                                                onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                                                style={S.input} placeholder="e.g. The Secrets of Kerala Green Cardamom" />
                                        </Field>
                                        <Field label="Excerpt (Short Summary) *">
                                            <textarea required value={blogForm.excerpt}
                                                onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                                                style={{ ...S.textarea, minHeight: '80px' }}
                                                placeholder="A short paragraph that appears in blog listing cards..." />
                                        </Field>
                                        <Field label="Content (Full Article) *">
                                            <textarea required value={blogForm.content}
                                                onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
                                                style={{ ...S.textarea, minHeight: '200px' }}
                                                placeholder="Write the full blog content here. You can use basic HTML tags..." />
                                        </Field>
                                        <Field label="Cover Image URL">
                                            <input type="text" value={blogForm.coverImage}
                                                onChange={e => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                                                style={S.input} placeholder="https://example.com/blog-cover.jpg" />
                                        </Field>
                                        <Grid cols="1fr 1fr 1fr">
                                            <Field label="Author">
                                                <input type="text" value={blogForm.author}
                                                    onChange={e => setBlogForm({ ...blogForm, author: e.target.value })}
                                                    style={S.input} />
                                            </Field>
                                            <Field label="Category">
                                                <select value={blogForm.category}
                                                    onChange={e => setBlogForm({ ...blogForm, category: e.target.value })}
                                                    style={S.select}>
                                                    {['Spice Guide', 'Recipes', 'Farm Stories', 'Health & Wellness', 'News', 'General'].map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </Field>
                                            <Field label="Read Time (mins)">
                                                <input type="number" min="1" value={blogForm.readTime}
                                                    onChange={e => setBlogForm({ ...blogForm, readTime: e.target.value })}
                                                    style={S.input} />
                                            </Field>
                                        </Grid>
                                        <Field label="Tags (comma-separated)">
                                            <input type="text" value={blogForm.tags}
                                                onChange={e => setBlogForm({ ...blogForm, tags: e.target.value })}
                                                style={S.input} placeholder="cardamom, kerala, spices, organic" />
                                        </Field>
                                        <div style={{ display: 'flex', gap: '24px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={blogForm.published}
                                                    onChange={e => setBlogForm({ ...blogForm, published: e.target.checked })} />
                                                Published (visible to public)
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={blogForm.featured}
                                                    onChange={e => setBlogForm({ ...blogForm, featured: e.target.checked })} />
                                                Featured Post
                                            </label>
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                                            <button type="button" onClick={() => setShowBlogForm(false)} style={S.btn('secondary')}>
                                                Cancel
                                            </button>
                                            <button type="submit" disabled={blogLoading} style={S.btn('primary')}>
                                                {blogLoading ? 'Saving…' : editingBlog ? 'Update Post' : 'Publish Post'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Blog List */}
                        <div style={S.card}>
                            <div style={{ marginBottom: '16px' }}>
                                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#1a2b15', margin: 0 }}>
                                    All Blog Posts ({blogs.length})
                                </h2>
                            </div>
                            {blogs.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>
                                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>📝</div>
                                    <p>No blog posts yet. Create your first post!</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                    <div style={{
                                        display: 'grid', gridTemplateColumns: '80px 1fr 120px 100px 120px',
                                        gap: '12px', padding: '10px 16px',
                                        background: '#f4f6f0', borderRadius: '8px 8px 0 0',
                                        fontSize: '11px', fontWeight: 700, color: '#4a5a40',
                                        letterSpacing: '0.8px', textTransform: 'uppercase',
                                        borderBottom: '1px solid #e8ede0',
                                    }}>
                                        <span>Cover</span>
                                        <span>Title</span>
                                        <span>Category</span>
                                        <span>Status</span>
                                        <span>Actions</span>
                                    </div>
                                    {blogs.map((b, idx) => (
                                        <div key={b._id} style={{
                                            display: 'grid', gridTemplateColumns: '80px 1fr 120px 100px 120px',
                                            gap: '12px', padding: '14px 16px',
                                            borderBottom: idx < blogs.length - 1 ? '1px solid #f0f4ec' : 'none',
                                            alignItems: 'center',
                                        }}
                                            onMouseEnter={e => (e.currentTarget.style.background = '#fafcf8')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                        >
                                            <div style={{
                                                width: '64px', height: '44px', borderRadius: '6px',
                                                background: '#f0f4ec', overflow: 'hidden',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                {b.coverImage ? (
                                                    <img src={b.coverImage} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <span style={{ fontSize: '20px' }}>📄</span>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '14px', color: '#1a2b15', marginBottom: '3px' }}>
                                                    {b.title}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#888', display: 'flex', gap: '10px' }}>
                                                    <span>By {b.author}</span>
                                                    <span>·</span>
                                                    <span>{b.readTime} min read</span>
                                                    {b.featured && <span style={S.badge('active')}>Featured</span>}
                                                </div>
                                            </div>
                                            <span style={{ fontSize: '13px', color: '#666' }}>{b.category}</span>
                                            <span style={S.badge(b.published ? 'published' : 'draft')}>
                                                {b.published ? 'Published' : 'Draft'}
                                            </span>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => openEditBlog(b)}
                                                    style={{ ...S.btn('secondary'), padding: '6px 12px', fontSize: '12px' }}>
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDeleteBlog(b._id)}
                                                    disabled={deletingBlogId === b._id}
                                                    style={{ ...S.btn('danger'), padding: '6px 12px', fontSize: '12px', opacity: deletingBlogId === b._id ? 0.5 : 1 }}>
                                                    {deletingBlogId === b._id ? '…' : 'Del'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── GRADING SECTION TAB ─── */}
                {activeTab === 'grading' && (
                    <div>
                        <div style={S.topbar}>
                            <h1 style={S.pageTitle}>Grading Section</h1>
                        </div>

                        {gradingMsg && <div style={S.alert(gradingMsgType)}>{gradingMsg}</div>}

                        <form onSubmit={handleGradingSave} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                            {/* Section Text */}
                            <div style={S.card}>
                                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#1a2b15', margin: '0 0 20px' }}>
                                    Section Text
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <Field label="Section Title">
                                        <input type="text" value={gradingTitle}
                                            onChange={e => setGradingTitle(e.target.value)}
                                            style={S.input} placeholder="Graded to your Requirement" />
                                    </Field>
                                    <Field label="Section Body Text">
                                        <textarea value={gradingBody}
                                            onChange={e => setGradingBody(e.target.value)}
                                            style={{ ...S.textarea, minHeight: '110px' }} />
                                    </Field>
                                </div>
                            </div>

                            {/* Grade Cards */}
                            <div style={S.card}>
                                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#1a2b15', margin: '0 0 6px' }}>
                                    Grade Cards
                                </h2>
                                <p style={{ color: '#888', fontSize: '13px', fontFamily: 'Jost', marginBottom: '24px' }}>
                                    Edit each grade card. Changes appear live on the home page after saving.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {gradingGrades.map((grade, i) => (
                                        <div key={i} style={{
                                            border: '1px solid #e8ede0', borderRadius: '12px',
                                            padding: '20px', background: '#fafcf8',
                                        }}>
                                            {/* Grade card header */}
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '14px',
                                                marginBottom: '18px',
                                            }}>
                                                {/* Mini preview */}
                                                <div style={{
                                                    width: '52px', minWidth: '52px', height: '64px',
                                                    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                                                    background: '#fff', borderRadius: '8px', border: '1px solid #e0e5d8',
                                                    padding: '6px',
                                                }}>
                                                    {grade.img && (
                                                        <img src={grade.img} alt={grade.label}
                                                            style={{ height: `${Math.min(grade.imgH, 48)}px`, width: 'auto', objectFit: 'contain' }} />
                                                    )}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#1a2b15' }}>{grade.label || `Grade ${i + 1}`}</div>
                                                </div>
                                            </div>

                                            <div style={{ marginTop: '14px' }}>
                                                <Field label="Grade Label">
                                                    <input type="text" value={grade.label}
                                                        onChange={e => updateGrade(i, 'label', e.target.value)}
                                                        style={S.input} placeholder="e.g. Purple Grade" />
                                                </Field>
                                            </div>

                                            <div style={{ marginTop: '14px' }}>
                                                <Field label="Image URL">
                                                    <input type="text" value={grade.img}
                                                        onChange={e => updateGrade(i, 'img', e.target.value)}
                                                        style={S.input} placeholder="https://cdn.shopify.com/..." />
                                                </Field>
                                            </div>

                                            <div style={{ marginTop: '14px' }}>
                                                <Field label="Display Height (px)">
                                                    <input type="number" min="30" max="150" value={grade.imgH}
                                                        onChange={e => updateGrade(i, 'imgH', Number(e.target.value))}
                                                        style={S.input} />
                                                </Field>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Live Preview strip */}
                            <div style={{ ...S.card, background: '#fff', textAlign: 'center', padding: '32px' }}>
                                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#4a6741', marginBottom: '8px' }}>
                                    🖥 Live Preview
                                </h3>
                                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', color: '#888', marginBottom: '28px', maxWidth: '500px', margin: '0 auto 28px' }}>
                                    {gradingBody.substring(0, 120)}{gradingBody.length > 120 ? '…' : ''}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '32px', flexWrap: 'wrap' }}>
                                    {gradingGrades.map((grade, i) => (
                                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                            {grade.img && (
                                                <img src={grade.img} alt={grade.label}
                                                    style={{
                                                        height: `${Math.round(grade.imgH * 0.65)}px`, width: 'auto', objectFit: 'contain',
                                                        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.10))'
                                                    }} />
                                            )}
                                            <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#888' }}>{grade.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" disabled={gradingLoading} style={{ ...S.btn('primary'), padding: '13px 32px', fontSize: '14px' }}>
                                    {gradingLoading ? 'Saving…' : '💾 Save Grading Section'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ─── COLLECTIONS TAB ─── */}
                {activeTab === 'collections' && (
                    <div>
                        <div style={S.topbar}>
                            <h1 style={S.pageTitle}>Page Collections</h1>
                        </div>

                        {collMsg && <div style={S.alert(collMsgType)}>{collMsg}</div>}

                        {!editingCollSlug ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                <div style={{
                                    display: 'grid', gridTemplateColumns: '80px 1fr 120px 120px',
                                    gap: '12px', padding: '10px 16px', background: '#f4f6f0',
                                    borderRadius: '8px 8px 0 0', fontSize: '11px', fontWeight: 700,
                                    color: '#4a5a40', letterSpacing: '0.8px', textTransform: 'uppercase',
                                    borderBottom: '1px solid #e8ede0',
                                }}>
                                    <span>Image</span>
                                    <span>Name & Route</span>
                                    <span>Price</span>
                                    <span>Actions</span>
                                </div>
                                {collections.map((c, idx) => (
                                    <div key={c.slug} style={{
                                        display: 'grid', gridTemplateColumns: '80px 1fr 120px 120px',
                                        gap: '12px', padding: '14px 16px',
                                        borderBottom: idx < collections.length - 1 ? '1px solid #f0f4ec' : 'none',
                                        alignItems: 'center', background: '#fff',
                                    }}
                                        onMouseEnter={e => (e.currentTarget.style.background = '#fafcf8')}
                                        onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                                    >
                                        <div style={{ width: '48px', height: '48px', background: '#fafcf8', borderRadius: '4px', padding: '4px', display: 'flex', justifyContent: 'center' }}>
                                            <img src={c.images[0]} alt={c.slug} style={{ height: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '14px', color: '#1a2b15' }}>{c.name}</div>
                                            <div style={{ fontSize: '12px', color: '#888' }}>/collection/{c.slug}</div>
                                        </div>
                                        <div style={{ fontWeight: 600, color: '#4a6741' }}>₹{c.price}</div>
                                        <div>
                                            <button onClick={() => openEditCollection(c)} style={{ ...S.btn('secondary'), padding: '6px 12px', fontSize: '12px' }}>
                                                Manage Page
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <form onSubmit={handleCollSave} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                                    <button type="button" onClick={() => { setEditingCollSlug(null); setCollMsg(''); }}
                                        style={{ ...S.btn('secondary'), padding: '8px 16px' }}>
                                        ← Back
                                    </button>
                                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#1a2b15', margin: 0 }}>
                                        Editing /collection/{editingCollSlug}
                                    </h2>
                                </div>

                                <div style={S.card}>
                                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#1a2b15', marginBottom: '16px' }}>
                                        Main Details
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <Field label="Page Title (Product Name)"><input type="text" style={S.input} value={collForm.name || ''} onChange={e => setCollForm(p => ({ ...p, name: e.target.value }))} required /></Field>
                                        <Grid cols="1fr 1fr" gap="16px">
                                            <Field label="Price (Rs.)"><input type="number" style={S.input} value={collForm.price || ''} onChange={e => setCollForm(p => ({ ...p, price: Number(e.target.value) }))} required /></Field>
                                            <Field label="Original Price (Rs.)"><input type="number" style={S.input} value={collForm.originalPrice || ''} onChange={e => setCollForm(p => ({ ...p, originalPrice: Number(e.target.value) }))} /></Field>
                                        </Grid>
                                        <Field label="Usage Description"><input type="text" style={S.input} value={collForm.usage || ''} onChange={e => setCollForm(p => ({ ...p, usage: e.target.value }))} /></Field>
                                        <Field label="Images (Comma separated URLs)">
                                            <textarea style={{ ...S.textarea, minHeight: '80px' }} value={(collForm.images || []).join(', ')} onChange={e => updateCollImages(e.target.value)} />
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                                {(collForm.images || []).map((img, i) => (
                                                    <img key={i} src={img} style={{ height: '40px', border: '1px solid #eee', borderRadius: '4px' }} alt="" />
                                                ))}
                                            </div>
                                        </Field>
                                    </div>
                                </div>

                                <div style={S.card}>
                                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#1a2b15', marginBottom: '16px' }}>
                                        Specs & Features
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <Grid cols="1fr 1fr" gap="16px">
                                            <Field label="Origin"><input type="text" style={S.input} value={collForm.origin || ''} onChange={e => setCollForm(p => ({ ...p, origin: e.target.value }))} /></Field>
                                            <Field label="Speciality"><input type="text" style={S.input} value={collForm.speciality || ''} onChange={e => setCollForm(p => ({ ...p, speciality: e.target.value }))} /></Field>
                                        </Grid>
                                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#4a6741', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Weights & Pricing</h4>
                                                <button type="button" onClick={addCollWeight} style={{ ...S.btn('secondary'), padding: '4px 8px', fontSize: '11px' }}>+ Add Weight</button>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {(collForm.weights || []).map((w, i) => (
                                                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#fafcf8', padding: '8px', borderRadius: '4px', border: '1px solid #e8ede0' }}>
                                                        <input type="text" style={{ ...S.input, flex: 1 }} value={w.weight} onChange={e => updateWeightObj(i, 'weight', e.target.value)} placeholder="Weight (e.g. 100 gm)" />
                                                        <input type="number" style={{ ...S.input, width: '100px' }} value={w.price || ''} onChange={e => updateWeightObj(i, 'price', Number(e.target.value))} placeholder="Price" />
                                                        <input type="number" style={{ ...S.input, width: '100px' }} value={w.originalPrice || ''} onChange={e => updateWeightObj(i, 'originalPrice', Number(e.target.value))} placeholder="MRP" />
                                                        <button type="button" onClick={() => removeCollWeight(i)} style={{ background: 'transparent', border: 'none', color: '#c03030', cursor: 'pointer', padding: '4px' }}>✕</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#4a6741', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Feature Highlights</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {(collForm.features || []).map((f, i) => (
                                                    <div key={i} style={{ display: 'flex', gap: '12px' }}>
                                                        <input type="text" style={{ ...S.input, width: '60px', textAlign: 'center' }} value={f.icon} onChange={e => updateFeature(i, 'icon', e.target.value)} placeholder="Icon (e.g. 🏅)" />
                                                        <input type="text" style={{ ...S.input, flex: 1 }} value={f.label} onChange={e => updateFeature(i, 'label', e.target.value)} placeholder="Feature Label" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                                    <button type="button" onClick={() => { setEditingCollSlug(null); setCollMsg(''); }} style={{ ...S.btn('secondary'), padding: '13px 24px', fontSize: '14px' }}>Cancel</button>
                                    <button type="submit" disabled={collLoading} style={{ ...S.btn('primary'), padding: '13px 32px', fontSize: '14px' }}>
                                        {collLoading ? 'Saving…' : '💾 Save Collection Page'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Jost:wght@300;400;500;600;700&display=swap');
                * { box-sizing: border-box; }
                input:focus, textarea:focus, select:focus {
                    border-color: #4a6741 !important;
                    box-shadow: 0 0 0 3px rgba(74,103,65,0.1) !important;
                }
            `}</style>
        </div>
    );
}
