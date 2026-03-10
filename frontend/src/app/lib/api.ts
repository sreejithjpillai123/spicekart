// API base URL from environment
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });
    const data = await res.json();
    // Auto-clear stale/invalid token and reload to show login screen
    if (res.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin';
        return data; // prevent further execution
    }
    if (!data.success) throw new Error(data.message || 'API error');
    return data;
}


/* ──────────────────────────────────
   PRODUCTS
────────────────────────────────── */
export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice: number | null;
    badge: string | null;
    category: string;
    gradeColor: string;
    gradeAccent: string;
    stock: number;
    featured: boolean;
    isActive: boolean;
    images: string[];
    sizes: { label: string; price: number; stock: number }[];
    createdAt: string;
}

export async function getProducts(params?: {
    sort?: string;
    category?: string;
    search?: string;
}): Promise<Product[]> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const data = await apiFetch<{ products: Product[] }>(`/products${query ? '?' + query : ''}`);
    return data.products;
}

export async function getProduct(id: string): Promise<Product> {
    const data = await apiFetch<{ product: Product }>(`/products/${id}`);
    return data.product;
}

/* ──────────────────────────────────
   ORDERS
────────────────────────────────── */
export interface OrderItem {
    product: string;
    productName: string;
    quantity: number;
    price: number;
    size?: string;
}

export interface OrderPayload {
    customer: {
        name: string;
        email: string;
        phone?: string;
        address?: {
            street?: string;
            city?: string;
            state?: string;
            pincode?: string;
        };
    };
    items: OrderItem[];
    subtotal: number;
    discount?: number;
    shippingCharge?: number;
    total: number;
    paymentMethod?: string;
    notes?: string;
}

export async function placeOrder(payload: OrderPayload) {
    const data = await apiFetch<{ order: { orderNumber: string } }>('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    return data.order;
}

/* ──────────────────────────────────
   SUBSCRIBERS
────────────────────────────────── */
export async function subscribeNewsletter(email: string): Promise<{ message: string }> {
    const data = await apiFetch<{ message: string }>('/subscribers', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
    return data;
}

/* ──────────────────────────────────
   BLOGS
────────────────────────────────── */
export interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    author: string;
    category: string;
    tags: string[];
    published: boolean;
    featured: boolean;
    readTime: number;
    createdAt: string;
    updatedAt: string;
}

export async function getBlogs(params?: { category?: string; featured?: string; search?: string }): Promise<Blog[]> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const data = await apiFetch<{ blogs: Blog[] }>(`/blogs${query ? '?' + query : ''}`);
    return data.blogs;
}

export async function getBlog(id: string): Promise<Blog> {
    const data = await apiFetch<{ blog: Blog }>(`/blogs/${id}`);
    return data.blog;
}

/* ──────────────────────────────────
   SHOP SETTINGS
────────────────────────────────── */
export interface GradingGrade {
    label: string;
    img: string;
    imgH: number;
}

export interface ShopSettings {
    heroBannerTitle: string;
    heroBannerSubtitle: string;
    sectionEyebrow: string;
    sectionTitle: string;
    sectionBody: string;
    featuredEnabled: boolean;
    enabledCategories: string[];
    gradingTitle: string;
    gradingBody: string;
    gradingGrades: GradingGrade[];
}

export async function getShopSettings(): Promise<ShopSettings> {
    const data = await apiFetch<{ settings: ShopSettings }>('/shop-settings');
    return data.settings;
}

export async function getGradingSection(): Promise<{ title: string; body: string; grades: GradingGrade[] }> {
    const settings = await getShopSettings();
    return {
        title: settings.gradingTitle || 'Graded to your Requirement',
        body: settings.gradingBody || '',
        grades: settings.gradingGrades || [],
    };
}

/* ──────────────────────────────────
   GRADE COLLECTIONS
────────────────────────────────── */
export interface GradeFeature {
    icon: string;
    label: string;
}

export interface GradeWeightPrice {
    weight: string;
    price: number;
    originalPrice: number;
}

export interface GradeCollectionData {
    _id?: string;
    slug: string;
    name: string;
    grade: string;
    size: string;
    price: number;
    originalPrice: number;
    badgeColor: string;
    origin: string;
    speciality: string;
    usage: string;
    manufacturer: string;
    images: string[];
    weights: GradeWeightPrice[];
    features: GradeFeature[];
    isActive: boolean;
    sortOrder: number;
}

export async function getGradeCollections(): Promise<GradeCollectionData[]> {
    const data = await apiFetch<{ collections: GradeCollectionData[] }>('/grade-collections');
    return data.collections;
}

export async function getGradeCollection(slug: string): Promise<GradeCollectionData> {
    const data = await apiFetch<{ collection: GradeCollectionData }>(`/grade-collections/${slug}`);
    return data.collection;
}

export async function adminGetGradeCollections(token: string): Promise<GradeCollectionData[]> {
    const data = await apiFetch<{ collections: GradeCollectionData[] }>('/grade-collections/admin/all', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.collections;
}

export async function adminUpdateGradeCollection(
    token: string,
    slug: string,
    body: Partial<GradeCollectionData>
): Promise<GradeCollectionData> {
    const data = await apiFetch<{ collection: GradeCollectionData }>(`/grade-collections/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
    });
    return data.collection;
}


/* ──────────────────────────────────
   ADMIN
────────────────────────────────── */
export async function adminLogin(email: string, password: string): Promise<{ token: string; admin: any }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Login failed');
    return data;
}

export async function getAdminProducts(token: string): Promise<Product[]> {
    const data = await apiFetch<{ products: Product[] }>('/products/all', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.products;
}

export async function createProduct(token: string, productData: any): Promise<Product> {
    const data = await apiFetch<{ product: Product }>('/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(productData),
    });
    return data.product;
}

export async function updateProduct(token: string, id: string, productData: any): Promise<Product> {
    const data = await apiFetch<{ product: Product }>(`/products/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(productData),
    });
    return data.product;
}

export async function deleteProduct(token: string, id: string): Promise<void> {
    await apiFetch<{ message: string }>(`/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function getAdminBlogs(token: string): Promise<Blog[]> {
    const data = await apiFetch<{ blogs: Blog[] }>('/blogs/all', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.blogs;
}

export async function createBlog(token: string, blogData: any): Promise<Blog> {
    const data = await apiFetch<{ blog: Blog }>('/blogs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(blogData),
    });
    return data.blog;
}

export async function updateBlog(token: string, id: string, blogData: any): Promise<Blog> {
    const data = await apiFetch<{ blog: Blog }>(`/blogs/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(blogData),
    });
    return data.blog;
}

export async function deleteBlog(token: string, id: string): Promise<void> {
    await apiFetch<{ message: string }>(`/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function updateShopSettings(token: string, settingsData: any): Promise<ShopSettings> {
    const data = await apiFetch<{ settings: ShopSettings }>('/shop-settings', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(settingsData),
    });
    return data.settings;
}
