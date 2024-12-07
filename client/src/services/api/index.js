import { createAxiosInstance } from "./axiosConfig";

// Fetch customer info
export const getCustomerInfo = async (customerID) => {
    try {
        const response = await createAxiosInstance({
            url: "/customer",
            method: "GET",
            params: { userID: customerID.Customer_ID },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching customer info:", error.message);
        throw error;
    }
};

// Fetch all products
export const getAllProducts = async () => {
    try {
        const response = await createAxiosInstance({
            url: "/shop",
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching all products:", error.message);
        throw error;
    }
};

// Fetch products by category
export const getProductsByCategory = async (category) => {
    try {
        const response = await createAxiosInstance({
            url: "/shop",
            method: "GET",
            params: { Product_Category: category },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching products by category (${category}):`, error.message);
        throw error;
    }
};

// Fetch coupons
export const fetchCoupons = async () => {
    try {
        const response = await createAxiosInstance({
            url: "/fetchcoupons",
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching coupons:", error.message);
        throw error;
    }
};

// Add a customer
export const addCustomer = async (payload) => {
    try {
        const response = await createAxiosInstance({
            url: "/customer",
            method: "POST",
            data: payload,
        });
        return response.data;
    } catch (error) {
        console.error("Error adding customer:", error.message);
        throw error;
    }
};

// Checkout
export const checkout = async (payload) => {
    try {
        const response = await createAxiosInstance({
            url: "/checkout",
            method: "POST",
            data: payload,
        });
        return response.data;
    } catch (error) {
        console.error("Error during checkout:", error.message);
        throw error;
    }
};
