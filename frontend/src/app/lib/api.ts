// API base URL from environment
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Generic fetch wrapper
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });
    const data = await res.json();
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
