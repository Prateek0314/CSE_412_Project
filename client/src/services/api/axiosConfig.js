import axios from "axios";

export const createAxiosInstance = (info) => {
    const { url, method, headers, data, params } = info;

    const axiosInstance = axios.create({
        baseURL: "http://localhost:5000", // Set the base URL here
        headers: {
            "Content-Type": "application/json",
            ...headers, // Allow custom headers to be passed
        },
    });

    return axiosInstance({ url, method, data, params });
};
