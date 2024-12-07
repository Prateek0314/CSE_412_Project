const BASE_URL = "http://127.0.0.1:5000";

async function fetchWithJSON(url, options) {
    const response = await fetch(url, options);
    const contentType = response.headers.get("Content-Type");
  
    if (!response.ok) {
      const errorText = await response.text(); // Get the full response text
      console.error(`Error: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      const text = await response.text(); // Log non-JSON responses for debugging
      console.error("Unexpected response format:", text);
      throw new Error("Response is not valid JSON");
    }
  }
  
  

async function addCustomer() {
    const payload = {
      Customer_ID: "123",
      Gender: "Male",
      Location: "City A",
      Total_Spent: 1000.00,
      Tenure_Months: 12,
    };
    const response = await fetch(`${BASE_URL}/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    console.log("POST /customer Response:", data);
  }
  
  async function getItemInfo(productSKU) {
    try {
      const data = await fetchWithJSON(`${BASE_URL}/item?Product_SKU=${productSKU}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("GET /item Response:", data);
    } catch (error) {
      console.error("Error in GET /item:", error.message);
    }
  }
  
  async function checkout() {
    const payload = {
      Transaction_Info: {
        Transaction_ID: "123",
        Customer_ID: "123",
        Transaction_Date: "2024-01-01",
        Delivery_Charge: 5.00,
        Coupon_Code: "123",
        Tax_Pct: 10,
        Products: ["12345"],
        Total_Price: 105.50,
      },
      Transaction_Detail: [
        {
          Transaction_ID: "123",
          Product_SKU: "12345",
          Purchased_Quantity: 2,
        },
      ],
    };
    const response = await fetch(`${BASE_URL}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    console.log("POST /checkout Response:", data);
  }

  async function fetchCoupons() {
    const response = await fetch(`${BASE_URL}/fetchcoupons`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("GET /fetchcoupons Response:", data);
  }

  async function getProductsByCategory(category) {
    const response = await fetch(`${BASE_URL}/shop?Product_Category=${category}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(`GET /shop (category ${category}) Response:`, data);
  }
  

  async function getAllProducts() {
    try {
      const data = await fetchWithJSON(`${BASE_URL}/shop`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("GET /shop (all products) Response:", data);
    } catch (error) {
      console.error("Error in GET /shop:", error.message);
    }
  }

  async function getCustomerInfo(customerID) {
    const response = await fetch(`${BASE_URL}/customer?Customer_ID=${customerID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("GET /customer Response:", data);
  }
  

  getCustomerInfo("123");
  getAllProducts();
  getProductsByCategory("Electronics");
  fetchCoupons();
  checkout();
  getItemInfo("12345");