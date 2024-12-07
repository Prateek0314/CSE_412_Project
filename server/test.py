import unittest
import requests

BASE_URL = "http://127.0.0.1:5000"  # Change this if your Flask app runs on a different host or port


class TestFlaskApp(unittest.TestCase):
    def test_add_coupon(self):
        # Test adding a coupon via the POST /admin endpoint
        payload = {
            "Coupon_Code": "123",
            "Coupon_Status": True,
            "Discount_pct": 10.00,
            "Coupon_Expiry": "2024-12-31",
            "Coupon_UsageLimit": 50,
        }
        response = requests.post(
            f"{BASE_URL}/admin",
            json=payload,
            headers={"Content-Type": "application/json"}  # Add Content-Type header
        )
        self.assertEqual(response.status_code, 201)
        print("POST /admin (add coupon) Response:", response.json())

        # Verify the coupon addition via GET /fetchcoupons endpoint
        fetch_response = requests.get(
            f"{BASE_URL}/fetchcoupons",
            headers={"Content-Type": "application/json"}  # Add Content-Type header
        )
        self.assertEqual(fetch_response.status_code, 200)
        coupons = fetch_response.json()
        print("GET /fetchcoupons (verify coupon) Response:", coupons)

        # Check if the added coupon is in the fetched coupons
        self.assertTrue(any(coupon['Coupon_Code'] == "123" for coupon in coupons),
                        "Added coupon is not found in the fetched coupons")

    def test_get_customer_info(self):
        # Test the GET /customer endpoint
        payload = {"Customer_ID": "123"}
        response = requests.get(
            f"{BASE_URL}/customer",
            json=payload,
            headers={"Content-Type": "application/json"}  # Add Content-Type header
        )
        self.assertEqual(response.status_code, 200)
        print("GET /customer Response:", response.json())

    def test_add_items(self):
        # Test the POST /admin endpoint
        payload = {
            "Product_SKU": "12345",
            "Product_Description": "Test Product",
            "Product_Category": "Electronics",
            "Item_Price": 100.50,
            "Store_Quantity": 10,
        }
        response = requests.post(
            f"{BASE_URL}/admin",
            json=payload,
            headers={"Content-Type": "application/json"}  # Add Content-Type header
        )
        self.assertEqual(response.status_code, 201)
        print("POST /admin Response:", response.json())

    def test_shop(self):
        # Test the GET /shop endpoint with and without a category
        response_all = requests.get(
            f"{BASE_URL}/shop",
            json=None,
            headers={"Content-Type": "application/json"}  # Add Content-Type header
        )
        self.assertEqual(response_all.status_code, 200)
        print("GET /shop (all products) Response:", response_all.json())

        response_category = requests.get(
            f"{BASE_URL}/shop",
            json={"Product_Category": "Electronics"},
            headers={"Content-Type": "application/json"}  # Add Content-Type header
        )
        self.assertEqual(response_category.status_code, 200)
        print("GET /shop (category Electronics) Response:", response_category.json())

    def test_fetch_coupons(self):
        # Test the GET /fetchcoupons endpoint
        response = requests.get(
            f"{BASE_URL}/fetchcoupons",
            headers={"Content-Type": "application/json"}  # Add Content-Type header
        )
        self.assertEqual(response.status_code, 200)
        print("GET /fetchcoupons Response:", response.json())

    def test_checkout(self):
        # Test the POST /checkout endpoint
        payload = {
            "Transaction_Info": {
                "Transaction_ID": "123",
                "Customer_ID": "123",
                "Transaction_Date": "2024-01-01",
                "Delivery_Charge": 5.00,
                "Products": ["Test Product"],
                "Total_Price": 105.50,
            },
            "Transaction_Detail": [
                {
                    "Transaction_ID": "123",
                    "Product_SKU": "12345",
                    "Coupon_Code": "123",
                    "Tax_Pct": 10,
                    "Purchased_Quantity": 2,
                }
            ],
        }
        response = requests.post(
            f"{BASE_URL}/checkout",
            json=payload,
            headers={"Content-Type": "application/json"}  # Add Content-Type header
        )
        self.assertEqual(response.status_code, 201)
        print("POST /checkout Response:", response.json())

    def test_get_item_info(self):
        # Test the GET /item endpoint
        payload = {"Product_SKU": "12345"}
        response = requests.get(
            f"{BASE_URL}/item",
            json=payload,
            headers={"Content-Type": "application/json"}  # Add Content-Type header
        )
        self.assertEqual(response.status_code, 200)
        print("GET /item Response:", response.json())

    def test_add_customer(self):
        # Test the POST /customer endpoint
        payload = {
            "Customer_ID": "123",
            "Gender": "Male",
            "Location": "City A",
            "Total_Spent": 1000.00,
            "Tenure_Months": 12,
        }
        response = requests.post(
            f"{BASE_URL}/customer",
            json=payload,
            headers={"Content-Type": "application/json"}  # Add Content-Type header
        )
        self.assertEqual(response.status_code, 201)
        print("POST /customer Response:", response.json())

    def test_update_transaction(self):
        # Test the PUT /transaction endpoint
        payload = {
            "Transaction_ID": "123",
            "updates": {"Total_Price": 110.50},
        }
        response = requests.put(
            f"{BASE_URL}/transaction",
            json=payload,
            headers={"Content-Type": "application/json"}  # Add Content-Type header
        )
        self.assertEqual(response.status_code, 200)
        print("PUT /transaction Response:", response.json())


if __name__ == "__main__":
    unittest.main()
