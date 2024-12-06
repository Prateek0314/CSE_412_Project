import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (sku, quantity) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.sku === sku);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.sku === sku ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prevCart, {sku, quantity}];
        });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};