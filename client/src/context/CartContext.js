import { Alert, Snackbar } from "@mui/material";
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

    const addToCart = (sku, description, quantity, price) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.sku === sku);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.sku === sku ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prevCart, {sku, description, quantity, price}];
        });

        showToast(`${description} added to cart!`, 'success')
    };

    const removeFromCart = (sku) => {
        const removedItem = cart.find((item) => item.sku === sku);
        setCart((prevCart) => prevCart.filter((item) => item.sku !== sku));

        showToast(`${removedItem.description} removed from cart.`, 'info');
    };

    const showToast = (message, severity) => {
        setToast({ open: true, message, severity });
    };
    
    const closeToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={closeToast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={closeToast} severity={toast.severity} variant="filled">
                    {toast.message}
                </Alert>
            </Snackbar>
        </CartContext.Provider>
    );
};