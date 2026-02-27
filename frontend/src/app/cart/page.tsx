'use client';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useState } from 'react';
import { placeOrder } from '../lib/api';

export default function CartPage() {
    const { items, totalItems, totalPrice, removeFromCart, clearCart } = useCart();
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', street: '', city: '', state: '', pincode: '' });
    const [ordering, setOrdering] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
    const [orderError, setOrderError] = useState<string | null>(null);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setOrdering(true);
        setOrderError(null);
        try {
            const order = await placeOrder({
                customer: {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
                },
                items: items.map(i => ({
                    product: i.product._id,
                    productName: i.product.name,
                    quantity: i.quantity,
                    price: i.selectedSize?.price ?? i.product.price,
                    size: i.selectedSize?.label,
                })),
                subtotal: totalPrice,
                shippingCharge: totalPrice > 500 ? 0 : 60,
                total: totalPrice > 500 ? totalPrice : totalPrice + 60,
                paymentMethod: 'COD',
            });
            setOrderSuccess(order.orderNumber);
            clearCart();
        } catch (err: unknown) {
            setOrderError(err instanceof Error ? err.message : 'Failed to place order');
        } finally {
            setOrdering(false);
        }
    };

    const shipping = totalPrice > 500 ? 0 : 60;
    const grandTotal = totalPrice + shipping;

    return (
        <>
            <Navbar />
            <main style={{ minHeight: '100vh', background: '#faf8f4', paddingTop: '100px', paddingBottom: '80px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>

                    {/* Order Success */}
                    {orderSuccess && (
                        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 24px rgba(0,0,0,0.07)' }}>
                            <div style={{ fontSize: '60px', marginBottom: '24px' }}>🎉</div>
                            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#1a4a10', marginBottom: '12px' }}>Order Placed Successfully!</h2>
                            <p style={{ fontFamily: 'Jost, sans-serif', color: '#666', marginBottom: '8px' }}>Your order number is:</p>
                            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '22px', fontWeight: 800, color: '#4a6741', marginBottom: '28px' }}>{orderSuccess}</p>
                            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#888', marginBottom: '32px' }}>We'll confirm your order shortly. Thank you for choosing SpiceKart!</p>
                            <Link href="/shop" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px', background: '#4a6741', color: '#fff', padding: '14px 32px', textDecoration: 'none', borderRadius: '4px' }}>
                                Continue Shopping
                            </Link>
                        </div>
                    )}

                    {/* Empty cart */}
                    {!orderSuccess && items.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 24px rgba(0,0,0,0.07)' }}>
                            <div style={{ fontSize: '60px', marginBottom: '24px' }}>🛒</div>
                            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', color: '#2c2c2c', marginBottom: '12px' }}>Your cart is empty</h2>
                            <p style={{ fontFamily: 'Jost, sans-serif', color: '#888', marginBottom: '32px' }}>Discover our premium spice collection</p>
                            <Link href="/shop" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px', background: '#4a6741', color: '#fff', padding: '14px 32px', textDecoration: 'none', borderRadius: '4px' }}>
                                Shop Now
                            </Link>
                        </div>
                    )}

                    {/* Cart with items */}
                    {!orderSuccess && items.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>
                            {/* Left — items */}
                            <div>
                                <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#1a4a10', marginBottom: '24px' }}>
                                    Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                                </h1>
                                <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                                    {items.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderBottom: idx < items.length - 1 ? '1px solid #f0ece4' : 'none' }}>
                                            <div style={{ width: '64px', height: '64px', borderRadius: '8px', background: `linear-gradient(135deg, ${item.product.gradeColor}22, ${item.product.gradeAccent}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>🌿</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontWeight: 600, color: '#1a4a10', marginBottom: '4px' }}>{item.product.name}</div>
                                                {item.selectedSize && <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#888' }}>Size: {item.selectedSize.label}</div>}
                                                <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#4a6741', fontWeight: 600, marginTop: '4px' }}>
                                                    ₹{(item.selectedSize?.price ?? item.product.price).toLocaleString('en-IN')} × {item.quantity}
                                                </div>
                                            </div>
                                            <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', fontWeight: 700, color: '#2c2c2c', minWidth: '80px', textAlign: 'right' }}>
                                                ₹{((item.selectedSize?.price ?? item.product.price) * item.quantity).toLocaleString('en-IN')}
                                            </div>
                                            <button onClick={() => removeFromCart(item.product._id)} style={{ background: 'none', border: 'none', color: '#c04040', cursor: 'pointer', fontSize: '18px', padding: '4px' }} title="Remove">✕</button>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                    <Link href="/shop" style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', color: '#4a6741', textDecoration: 'none' }}>← Continue Shopping</Link>
                                    <button onClick={clearCart} style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#c04040', background: 'none', border: 'none', cursor: 'pointer' }}>Clear Cart</button>
                                </div>
                            </div>

                            {/* Right — Summary + Checkout */}
                            <div>
                                <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: '24px', marginBottom: '16px' }}>
                                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#1a4a10', marginBottom: '20px' }}>Order Summary</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}><span>Subtotal</span><span>₹{totalPrice.toLocaleString('en-IN')}</span></div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}><span>Shipping</span><span style={{ color: shipping === 0 ? '#4a6741' : '#2c2c2c' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                                        {shipping > 0 && <div style={{ fontSize: '11px', color: '#999' }}>Add ₹{(500 - totalPrice).toLocaleString('en-IN')} more for free shipping</div>}
                                        <div style={{ height: '1px', background: '#f0ece4' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '16px', color: '#1a4a10' }}><span>Total</span><span>₹{grandTotal.toLocaleString('en-IN')}</span></div>
                                    </div>
                                    <button
                                        onClick={() => setCheckoutOpen(true)}
                                        style={{ width: '100%', marginTop: '20px', padding: '14px', background: 'linear-gradient(135deg, #4a6741, #3a5531)', color: '#fff', border: 'none', borderRadius: '4px', fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                                <div style={{ background: '#f0f5ee', borderRadius: '8px', padding: '14px 16px', fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#4a6741' }}>
                                    🔒 Secure checkout · COD available
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Checkout Modal */}
                    {checkoutOpen && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                            <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)', position: 'relative' }}>
                                <button onClick={() => setCheckoutOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>
                                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: '#1a4a10', marginBottom: '24px' }}>Complete Your Order</h2>
                                {orderError && <div style={{ background: '#fff0f0', border: '1px solid #f0c0c0', borderRadius: '6px', padding: '12px', marginBottom: '16px', fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#c03030' }}>{orderError}</div>}
                                <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {[
                                        { label: 'Full Name *', id: 'name', type: 'text', required: true },
                                        { label: 'Email *', id: 'email', type: 'email', required: true },
                                        { label: 'Phone', id: 'phone', type: 'tel', required: false },
                                        { label: 'Street Address', id: 'street', type: 'text', required: false },
                                        { label: 'City', id: 'city', type: 'text', required: false },
                                        { label: 'State', id: 'state', type: 'text', required: false },
                                        { label: 'PIN Code', id: 'pincode', type: 'text', required: false },
                                    ].map(f => (
                                        <div key={f.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <label style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#666' }}>{f.label}</label>
                                            <input
                                                type={f.type}
                                                required={f.required}
                                                value={form[f.id as keyof typeof form]}
                                                onChange={e => setForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                                                style={{ padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontFamily: 'Jost, sans-serif', fontSize: '13px', outline: 'none' }}
                                            />
                                        </div>
                                    ))}
                                    <div style={{ marginTop: '8px', padding: '14px', background: '#f0f5ee', borderRadius: '6px', fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#4a6741' }}>
                                        💳 Payment: Cash on Delivery (COD) &nbsp;|&nbsp; Total: <strong>₹{grandTotal.toLocaleString('en-IN')}</strong>
                                    </div>
                                    <button type="submit" disabled={ordering} style={{ padding: '14px', background: '#4a6741', color: '#fff', border: 'none', borderRadius: '6px', fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 700, cursor: ordering ? 'wait' : 'pointer', opacity: ordering ? 0.8 : 1 }}>
                                        {ordering ? 'Placing Order…' : `Place Order · ₹${grandTotal.toLocaleString('en-IN')}`}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
