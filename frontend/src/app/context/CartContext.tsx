'use client';
import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { Product } from '../lib/api';

export interface CartItem {
    product: Product;
    quantity: number;
    selectedSize?: { label: string; price: number };
}

interface CartState {
    items: CartItem[];
}

type CartAction =
    | { type: 'ADD'; payload: CartItem }
    | { type: 'REMOVE'; productId: string }
    | { type: 'UPDATE_QTY'; productId: string; quantity: number }
    | { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD': {
            const existing = state.items.findIndex(
                i => i.product._id === action.payload.product._id &&
                    i.selectedSize?.label === action.payload.selectedSize?.label
            );
            if (existing >= 0) {
                const items = [...state.items];
                items[existing] = { ...items[existing], quantity: items[existing].quantity + action.payload.quantity };
                return { items };
            }
            return { items: [...state.items, action.payload] };
        }
        case 'REMOVE':
            return { items: state.items.filter(i => i.product._id !== action.productId) };
        case 'UPDATE_QTY':
            return { items: state.items.map(i => i.product._id === action.productId ? { ...i, quantity: action.quantity } : i) };
        case 'CLEAR':
            return { items: [] };
        default:
            return state;
    }
}

const CartContext = createContext<{
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    addToCart: (product: Product, quantity?: number, size?: { label: string; price: number }) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('sk_cart');
                return saved ? JSON.parse(saved) : { items: [] };
            } catch { return { items: [] }; }
        }
        return { items: [] };
    });

    useEffect(() => {
        localStorage.setItem('sk_cart', JSON.stringify(state));
    }, [state]);

    const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = state.items.reduce((sum, i) => {
        const price = i.selectedSize?.price ?? i.product.price;
        return sum + price * i.quantity;
    }, 0);

    const addToCart = (product: Product, quantity = 1, size?: { label: string; price: number }) => {
        dispatch({ type: 'ADD', payload: { product, quantity, selectedSize: size } });
    };

    const removeFromCart = (productId: string) => {
        dispatch({ type: 'REMOVE', productId });
    };

    const clearCart = () => dispatch({ type: 'CLEAR' });

    return (
        <CartContext.Provider value={{ items: state.items, totalItems, totalPrice, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
}
