import React, { createContext, useContext, useState } from "react";
import { useCart } from "./CartContext";

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const { clearCart } = useCart();

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        clearCart();
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}