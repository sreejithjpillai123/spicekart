/* ═══════════════════════════════════════════════
   SpiceKart Admin Panel — JavaScript
   ═══════════════════════════════════════════════ */

const API = 'http://localhost:5000/api';
let authToken = localStorage.getItem('sk_admin_token') || null;
let allProducts = [];
let currentOrderPage = 1;

/* ────────────────────────────────
   INIT
──────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);

    if (authToken) {
        verifyAndLoad();
    } else {
        showLogin();
    }

    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('product-form').addEventListener('submit', handleProductSubmit);
});

function updateClock() {
    const now = new Date();
    const el = document.getElementById('header-time');
    if (el) el.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

/* ────────────────────────────────
   AUTH
──────────────────────────────── */
async function verifyAndLoad() {
    try {
        const res = await apiFetch('/auth/me');
        if (res.success) {
            document.getElementById('admin-name-display').textContent = res.admin.name;
            showApp();
            loadDashboard();
        } else {
            logout();
        }
    } catch {
        logout();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-login');
    const btnText = document.getElementById('login-btn-text');
    const spinner = document.getElementById('login-spinner');
    const errEl = document.getElementById('login-error');

    btnText.classList.add('hidden');
    spinner.classList.remove('hidden');
    btn.disabled = true;
    errEl.classList.add('hidden');

    try {
        const data = await apiFetch('/auth/login', 'POST', { email, password });
        if (data.success) {
            authToken = data.token;
            localStorage.setItem('sk_admin_token', authToken);
            document.getElementById('admin-name-display').textContent = data.admin.name;
            showApp();
            loadDashboard();
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (err) {
        errEl.textContent = err.message || 'Login failed. Check credentials.';
        errEl.classList.remove('hidden');
    } finally {
        btnText.classList.remove('hidden');
        spinner.classList.add('hidden');
        btn.disabled = false;
    }
}

function logout() {
    authToken = null;
    localStorage.removeItem('sk_admin_token');
    showLogin();
}

function togglePassword() {
    const inp = document.getElementById('login-password');
    inp.type = inp.type === 'password' ? 'text' : 'password';
}

/* ────────────────────────────────
   UI HELPERS
──────────────────────────────── */
function showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}

function showApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
}

function showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    document.getElementById(`section-${name}`).classList.add('active');
    document.querySelector(`.nav-item[data-section="${name}"]`).classList.add('active');
    document.getElementById('header-title').textContent =
        { dashboard: 'Dashboard', products: 'Products', orders: 'Orders', subscribers: 'Subscribers' }[name] || name;

    if (name === 'products') loadProducts();
    if (name === 'orders') loadOrders();
    if (name === 'subscribers') loadSubscribers();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type}`;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3500);
}

/* ────────────────────────────────
   API FETCH
──────────────────────────────── */
async function apiFetch(path, method = 'GET', body = null) {
    const opts = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (authToken) opts.headers['Authorization'] = `Bearer ${authToken}`;
    if (body) opts.body = JSON.stringify(body);

    try {
        const res = await fetch(`${API}${path}`, opts);
        const data = await res.json();
        if (res.status === 401) { logout(); return; }
        document.getElementById('conn-dot').classList.remove('offline');
        return data;
    } catch (err) {
        document.getElementById('conn-dot').classList.add('offline');
        throw new Error('Network error — is the server running?');
    }
}

/* ────────────────────────────────
   DASHBOARD
──────────────────────────────── */
async function loadDashboard() {
    try {
        const data = await apiFetch('/orders/stats');
        if (!data?.success) return;

        const s = data.stats;
        document.getElementById('stat-revenue').textContent = `₹${s.totalRevenue.toLocaleString('en-IN')}`;
        document.getElementById('stat-orders').textContent = s.totalOrders.toLocaleString();
        document.getElementById('stat-pending').textContent = s.pendingOrders.toLocaleString();
        document.getElementById('stat-today').textContent = `₹${s.todayRevenue.toLocaleString('en-IN')}`;

        // Pending badge
        document.getElementById('pending-badge').textContent = s.pendingOrders;

        // Bar chart
        renderBarChart(s.last7Days);

        // Recent orders
        renderRecentOrders(s.recentOrders);
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function renderBarChart(days) {
    const container = document.getElementById('bar-chart');
    if (!days || !days.length) { container.innerHTML = '<p style="color:var(--text-muted);padding:20px">No data</p>'; return; }

    const maxRev = Math.max(...days.map(d => d.revenue), 1);
    container.innerHTML = days.map(d => {
        const pct = Math.max((d.revenue / maxRev) * 100, 2);
        return `
        <div class="chart-bar-group">
            <div class="chart-val">₹${d.revenue > 999 ? (d.revenue / 1000).toFixed(1) + 'k' : d.revenue}</div>
            <div class="chart-bar-wrap">
                <div class="chart-bar" style="height:${pct}%" title="₹${d.revenue.toLocaleString()} | ${d.orders} orders"></div>
            </div>
            <div class="chart-label">${d.date}</div>
        </div>`;
    }).join('');
}

function renderRecentOrders(orders) {
    const el = document.getElementById('recent-orders-list');
    if (!orders || !orders.length) {
        el.innerHTML = `<div class="empty-state"><div class="empty-icon">📦</div><p>No orders yet</p></div>`;
        return;
    }
    el.innerHTML = orders.map(o => `
        <div class="recent-order-row">
            <div>
                <div class="order-num">${o.orderNumber}</div>
                <div class="order-customer">${o.customer?.name || 'Unknown'}</div>
            </div>
            <div style="text-align:right">
                <div class="order-amount">₹${o.total?.toLocaleString('en-IN')}</div>
                <div>${getStatusBadge(o.status)}</div>
            </div>
        </div>
    `).join('');
}

/* ────────────────────────────────
   PRODUCTS
──────────────────────────────── */
async function loadProducts() {
    try {
        const data = await apiFetch('/products/all');
        if (!data?.success) return;
        allProducts = data.products;
        renderProductsTable(allProducts);
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function renderProductsTable(products) {
    const tbody = document.getElementById('products-tbody');
    document.getElementById('product-count').textContent = `${products.length} products`;

    if (!products.length) {
        tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">🌿</div><p>No products found</p></div></td></tr>`;
        return;
    }

    tbody.innerHTML = products.map(p => `
        <tr>
            <td>
                <div style="display:flex;align-items:center;gap:10px">
                    <div style="width:8px;height:36px;border-radius:4px;background:${p.gradeColor};flex-shrink:0"></div>
                    <div>
                        <div style="font-weight:600">${p.name}</div>
                        <div style="font-size:11px;color:var(--text-muted)">${p.category}</div>
                    </div>
                </div>
            </td>
            <td>
                <span style="font-weight:600;color:var(--accent)">₹${p.price.toLocaleString('en-IN')}</span>
                ${p.originalPrice ? `<span style="text-decoration:line-through;color:var(--text-muted);font-size:11px;margin-left:6px">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
            </td>
            <td>
                <span style="font-weight:600;color:${p.stock === 0 ? 'var(--danger)' : p.stock < 20 ? 'var(--warn)' : 'var(--text)'}">${p.stock}</span>
            </td>
            <td>${p.badge ? getBadgePill(p.badge) : '—'}</td>
            <td>${p.isActive ? '<span class="badge badge-active">Active</span>' : '<span class="badge badge-inactive">Inactive</span>'}</td>
            <td>
                <button class="btn-table btn-edit" onclick="openProductModal('${p._id}')">✏️ Edit</button>
                <button class="btn-table btn-delete" onclick="deleteProduct('${p._id}','${p.name}')">🗑 Delete</button>
            </td>
        </tr>
    `).join('');
}

function filterProducts() {
    const q = document.getElementById('product-search').value.toLowerCase();
    renderProductsTable(allProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
}

function openProductModal(id = null) {
    document.getElementById('product-modal').classList.remove('hidden');
    document.getElementById('modal-title').textContent = id ? 'Edit Product' : 'Add Product';
    document.getElementById('product-submit-btn').textContent = id ? 'Update Product' : 'Save Product';

    if (id) {
        const p = allProducts.find(x => x._id === id);
        if (!p) return;
        document.getElementById('product-id').value = p._id;
        document.getElementById('p-name').value = p.name;
        document.getElementById('p-category').value = p.category;
        document.getElementById('p-desc').value = p.description;
        document.getElementById('p-price').value = p.price;
        document.getElementById('p-original-price').value = p.originalPrice || '';
        document.getElementById('p-stock').value = p.stock;
        document.getElementById('p-badge').value = p.badge || '';
        document.getElementById('p-color').value = p.gradeColor || '#4a6741';
        document.getElementById('p-accent').value = p.gradeAccent || '#90c870';
        document.getElementById('p-featured').checked = p.featured;
        document.getElementById('p-active').checked = p.isActive;
    } else {
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        document.getElementById('p-active').checked = true;
        document.getElementById('p-color').value = '#4a6741';
        document.getElementById('p-accent').value = '#90c870';
    }
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

async function handleProductSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const btn = document.getElementById('product-submit-btn');

    const payload = {
        name: document.getElementById('p-name').value,
        category: document.getElementById('p-category').value,
        description: document.getElementById('p-desc').value,
        price: parseFloat(document.getElementById('p-price').value),
        originalPrice: parseFloat(document.getElementById('p-original-price').value) || null,
        stock: parseInt(document.getElementById('p-stock').value) || 0,
        badge: document.getElementById('p-badge').value || null,
        gradeColor: document.getElementById('p-color').value,
        gradeAccent: document.getElementById('p-accent').value,
        featured: document.getElementById('p-featured').checked,
        isActive: document.getElementById('p-active').checked,
    };

    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
        let data;
        if (id) {
            data = await apiFetch(`/products/${id}`, 'PUT', payload);
        } else {
            data = await apiFetch('/products', 'POST', payload);
        }

        if (data?.success) {
            showToast(id ? '✅ Product updated!' : '✅ Product created!');
            closeProductModal();
            loadProducts();
        } else {
            throw new Error(data?.message || 'Failed to save product');
        }
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = id ? 'Update Product' : 'Save Product';
    }
}

async function deleteProduct(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
        const data = await apiFetch(`/products/${id}`, 'DELETE');
        if (data?.success) {
            showToast('✅ Product deleted');
            loadProducts();
        } else {
            throw new Error(data?.message);
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

/* ────────────────────────────────
   ORDERS
──────────────────────────────── */
async function loadOrders(page = 1) {
    currentOrderPage = page;
    const status = document.getElementById('order-filter').value;
    const url = `/orders?page=${page}&limit=15${status ? '&status=' + status : ''}`;

    try {
        const data = await apiFetch(url);
        if (!data?.success) return;
        renderOrdersTable(data.orders);
        renderPagination(data.page, data.totalPages, 'loadOrders');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById('orders-tbody');
    if (!orders.length) {
        tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">📦</div><p>No orders found</p></div></td></tr>`;
        return;
    }
    tbody.innerHTML = orders.map(o => `
        <tr>
            <td><span style="font-weight:700;color:var(--accent2)">${o.orderNumber}</span></td>
            <td>
                <div style="font-weight:500">${o.customer?.name || '—'}</div>
                <div style="font-size:11px;color:var(--text-muted)">${o.customer?.email || ''}</div>
            </td>
            <td><span style="font-weight:700">₹${o.total?.toLocaleString('en-IN')}</span></td>
            <td>${getStatusBadge(o.status)}</td>
            <td>${getPaymentBadge(o.paymentStatus)}</td>
            <td style="white-space:nowrap;color:var(--text-muted);font-size:12px">${new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
            <td>
                <button class="btn-table btn-view" onclick="viewOrder('${o._id}')">👁 View</button>
            </td>
        </tr>
    `).join('');
}

async function viewOrder(id) {
    try {
        const data = await apiFetch(`/orders/${id}`);
        if (!data?.success) return;
        const o = data.order;

        document.getElementById('order-modal-title').textContent = `Order ${o.orderNumber}`;
        document.getElementById('order-detail-content').innerHTML = `
            <div class="order-detail">
                <div class="od-section">
                    <h4>Customer Information</h4>
                    <div class="od-grid">
                        <div class="od-field"><label>Name</label><span>${o.customer?.name || '—'}</span></div>
                        <div class="od-field"><label>Email</label><span>${o.customer?.email || '—'}</span></div>
                        <div class="od-field"><label>Phone</label><span>${o.customer?.phone || '—'}</span></div>
                        <div class="od-field"><label>Address</label><span>${formatAddress(o.customer?.address)}</span></div>
                    </div>
                </div>
                <div class="od-section">
                    <h4>Order Items</h4>
                    <div class="od-items">
                        ${o.items.map(item => `
                            <div class="od-item-row">
                                <div>
                                    <div style="font-weight:600">${item.productName || item.product?.name || '—'}</div>
                                    ${item.size ? `<div style="font-size:11px;color:var(--text-muted)">${item.size}</div>` : ''}
                                </div>
                                <div style="text-align:right">
                                    <div>Qty: ${item.quantity}</div>
                                    <div style="color:var(--accent);font-weight:600">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
                                </div>
                            </div>
                        `).join('')}
                        <div class="od-totals">
                            <div class="od-total-row"><span>Subtotal</span><span>₹${o.subtotal?.toLocaleString('en-IN')}</span></div>
                            ${o.discount ? `<div class="od-total-row"><span>Discount</span><span>-₹${o.discount?.toLocaleString('en-IN')}</span></div>` : ''}
                            ${o.shippingCharge ? `<div class="od-total-row"><span>Shipping</span><span>₹${o.shippingCharge?.toLocaleString('en-IN')}</span></div>` : ''}
                            <div class="od-total-row grand"><span>Total</span><span>₹${o.total?.toLocaleString('en-IN')}</span></div>
                        </div>
                    </div>
                </div>
                <div class="od-section">
                    <h4>Update Status</h4>
                    <div class="status-update">
                        <select id="order-status-sel">
                            ${['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'].map(s =>
            `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`
        ).join('')}
                        </select>
                        <select id="order-pay-sel">
                            ${['Pending', 'Paid', 'Failed', 'Refunded'].map(s =>
            `<option value="${s}" ${o.paymentStatus === s ? 'selected' : ''}>${s}</option>`
        ).join('')}
                        </select>
                        <button class="btn-primary" onclick="updateOrderStatus('${o._id}')">Update</button>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('order-modal').classList.remove('hidden');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function formatAddress(addr) {
    if (!addr) return '—';
    return [addr.street, addr.city, addr.state, addr.pincode, addr.country].filter(Boolean).join(', ') || '—';
}

async function updateOrderStatus(id) {
    const status = document.getElementById('order-status-sel').value;
    const paymentStatus = document.getElementById('order-pay-sel').value;
    try {
        const data = await apiFetch(`/orders/${id}/status`, 'PUT', { status, paymentStatus });
        if (data?.success) {
            showToast('✅ Order status updated!');
            closeOrderModal();
            loadOrders(currentOrderPage);
            loadDashboard();
        } else {
            throw new Error(data?.message);
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.add('hidden');
}

/* ────────────────────────────────
   SUBSCRIBERS
──────────────────────────────── */
async function loadSubscribers() {
    try {
        const data = await apiFetch('/subscribers');
        if (!data?.success) return;
        document.getElementById('sub-count-badge').textContent = `${data.count} subscribers`;

        const tbody = document.getElementById('subscribers-tbody');
        if (!data.subscribers.length) {
            tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-icon">✉️</div><p>No subscribers yet</p></div></td></tr>`;
            return;
        }
        tbody.innerHTML = data.subscribers.map(s => `
            <tr>
                <td style="font-weight:500">${s.email}</td>
                <td><span class="badge badge-active">${s.source}</span></td>
                <td style="color:var(--text-muted);font-size:12px">${new Date(s.subscribedAt).toLocaleDateString('en-IN')}</td>
                <td>
                    <button class="btn-table btn-delete" onclick="deleteSubscriber('${s._id}')">🗑 Remove</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteSubscriber(id) {
    if (!confirm('Remove this subscriber?')) return;
    try {
        const data = await apiFetch(`/subscribers/${id}`, 'DELETE');
        if (data?.success) {
            showToast('✅ Subscriber removed');
            loadSubscribers();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

/* ────────────────────────────────
   PAGINATION
──────────────────────────────── */
function renderPagination(page, totalPages, fn) {
    const el = document.getElementById('orders-pagination');
    if (totalPages <= 1) { el.innerHTML = ''; return; }
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === page ? 'active' : ''}" onclick="${fn}(${i})">${i}</button>`;
    }
    el.innerHTML = html;
}

/* ────────────────────────────────
   BADGE HELPERS
──────────────────────────────── */
function getBadgePill(badge) {
    if (!badge) return '';
    const map = { 'SALE': 'badge-sale', 'SOLD OUT': 'badge-soldout', 'NEW': 'badge-new', 'BEST SELLER': 'badge-bestseller' };
    return `<span class="badge ${map[badge] || ''}">${badge}</span>`;
}

function getStatusBadge(status) {
    const map = {
        'Pending': 'badge-pending', 'Confirmed': 'badge-confirmed',
        'Processing': 'badge-processing', 'Shipped': 'badge-shipped',
        'Delivered': 'badge-delivered', 'Cancelled': 'badge-cancelled', 'Refunded': 'badge-refunded',
    };
    return `<span class="badge ${map[status] || ''}">${status || '—'}</span>`;
}

function getPaymentBadge(status) {
    const map = { 'Pending': 'badge-pending', 'Paid': 'badge-delivered', 'Failed': 'badge-cancelled', 'Refunded': 'badge-refunded' };
    return `<span class="badge ${map[status] || ''}">💳 ${status || '—'}</span>`;
}
