from flask import Flask, jsonify, request
import psycopg2
from psycopg2 import sql
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)   

def establishConnection():
    conn = psycopg2.connect(
        host = os.getenv('host'),
        database = os.getenv('name'),
        user = os.getenv('user'),
        port = os.getenv('port')        
    )
    return conn

#For customer info and transaction history
@app.route('/customer', methods=['GET'])
def get_info():
    try:
        parameters = request.args.to_dict()#Whatever the args that we want to call for the endpoints, creates a dict of the arguments        
        if 'Customer_ID' not in parameters:
            return jsonify({"error": "Missing required fields"}), 400
        customerID = parameters['Customer_ID']
        conn = establishConnection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Customer_Info WHERE Customer_ID = %s;',(customerID,))#This is how to execute sql commands
        data = cursor.fetchall()
        cursor.execute('SELECT * FROM Transaction_Info WHERE Customer_ID = %s;',(customerID,))
        transaction_info = cursor.fetchall()
        cursor.close()
        conn.close()
        return {"Data":data[0],"History":transaction_info}
    except Exception as e:
        return jsonify({'Exception' : e}), 500

#For adding new items
@app.route('/admin', methods=['POST'])
def add_items():
    try:
        item_info = request.args.to_dict()#Whatever the args that we want to call for the endpoints, creates a dict of the arguments
        required_fields_item = ['Product_SKU', 'Product_Description','Product_Category','Item_Price','Store_Quantity']
        required_fields_coupon = ['Coupon_Code', 'Coupon_Status','Discount_pct','Coupon_UsageLimit']
        if not all(field in item_info for field in required_fields_item) or not not all(field in item_info for field in required_fields_coupon):
            return jsonify({"error": "Missing required fields"}), 400
        
        conn = establishConnection()
        cursor = conn.cursor()
        if 'Coupon_Code' in item_info:
            cursor.execute(''' INSERT INTO Coupon (Coupon_Code, Coupon_Status, Discount_pct, Coupon_UsageLimit) VALUES (%s, %s, %s, %s)''',
                (
                    item_info['Coupon_Code'],
                    item_info['Coupon_Status'],
                    item_info['Discount_pct'],
                    item_info['Coupon_UsageLimit']
                )
            )
        else:
            cursor.execute(''' INSERT INTO Product_Info (Product_SKU, Product_Description, Product_Category, Item_Price, Store_Quantity) VALUES (%s, %s, %s, %s, %s)''',
                (
                    item_info['Product_SKU'],
                    item_info['Product_Description'],
                    item_info['Product_Category'],
                    item_info['Item_Price'],
                    item_info['Store_Quantity']
                )
            )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Product added successfully"}), 201
    except Exception as e:
        return jsonify({'Exception' : e}), 500

#For getting all products or getting a product based on keyword
@app.route('/shop', methods=['GET'])
def search():
    try:
        shop_request = request.args.to_dict()#Whatever the args that we want to call for the endpoints, creates a dict of the arguments
        app.logger.debug(shop_request)
        if not (len(shop_request) == 0 or 'Product_Category' in shop_request):
            return jsonify({"error": "Missing required fields"}), 400
        conn = establishConnection()
        cursor = conn.cursor()
        if len(shop_request) == 0:
            cursor.execute('SELECT * FROM Product_Info;')#This is how to execute sql commands
        else:
            product_category = shop_request['Product_Category']
            cursor.execute('SELECT * FROM Product_Info WHERE Product_Category = %s;', (product_category,))#This is how to execute sql commands
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({'Exception' : e}), 500

#For getting coupons
@app.route('/fetchcoupons', methods=['GET'])
def fetch_coupons():
    try:
        parameters = request.args.to_dict()#Whatever the args that we want to call for the endpoints, creates a dict of the arguments
        conn = establishConnection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Coupon WHERE Coupon_Status = TRUE;')#This is how to execute sql commands
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({'Exception' : e}), 500     

#checking out(removing from database and adding to the customer table)
#The front end will send a tuple of transactioninfo and a list of transactiondetails
@app.route('/checkout', methods=['POST'])
def check_out():
    try:
        transaction_data = request.args.to_dict()        
        required_fields = ['Transaction_Info','Transaction_Detail']
        if transaction_data is None:
            return jsonify({"error": "Missing required fields"}), 400
        if not all(field in transaction_data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        if not create_transaction(transaction_data['Transaction_Info']):
            for field in transaction_data['Transaction_Detail']:
                if create_details(field):
                    return jsonify({"error": "Failed to add transaction details"}), 400
        else:
            return jsonify({"error": "Failed to add transaction info"}), 400
        return jsonify({"message": "Transaction added successfully"}), 201
    except Exception as e:
        return jsonify({'Exception' : e}), 500  

#Creates the transaction info
def create_transaction(transaction_info):
    required_fields = ['Transaction_ID','Customer_ID','Transaction_Date','Delivery_Charge','Coupon_Code','Tax_Pct','Products','Total_Price']    
    if not all(field in transaction_info for field in required_fields):        
        return True
    conn = establishConnection()
    cursor = conn.cursor()
    products = transaction_info['Products']    
    products = "{" + ",".join(products) + "}"
    cursor.execute(''' INSERT INTO Transaction_Info (Transaction_ID, Customer_ID, Transaction_Date, Delivery_Charge, Coupon_Code, Tax_Pct, Products, Total_Price) VALUES (%s, %s, %s, %s, %s,%s,%s,%s)''',
        (
            transaction_info['Transaction_ID'],
            transaction_info['Customer_ID'],
            transaction_info['Transaction_Date'],
            transaction_info['Delivery_Charge'],
            transaction_info['Coupon_Code'],
            transaction_info['Tax_Pct'],
            products,
            transaction_info['Total_Price']
        )
    )
    conn.commit()
    cursor.close()
    conn.close()
    return False

#Creates details for the created transaction
def create_details(transaction_detail):
    required_fields = ['Transaction_ID','Product_SKU','Purchased_Quantity']
    if not all(field in transaction_detail for field in required_fields):
        app.logger.debug(f"Received JSON")
        return True
    conn = establishConnection()
    cursor = conn.cursor()
    cursor.execute(''' INSERT INTO Transaction_Detail (Transaction_ID, Product_SKU, Purchased_Quantity) VALUES (%s, %s, %s)''',
        (
            transaction_detail['Transaction_ID'],
            transaction_detail['Product_SKU'],
            transaction_detail['Purchased_Quantity']            
        )
    )
    conn.commit()
    cursor.close()
    conn.close()
    return False

#Get information about specific item
@app.route('/item', methods=['GET'])
def get_item_info():
    try:
        item_request = request.args.to_dict()#Whatever the args that we want to call for the endpoints, creates a dict of the arguments        
        if 'Product_SKU' not in item_request:
            return jsonify({"error": "Missing required fields"}), 400
        ProductSKU = item_request['Product_SKU']
        conn = establishConnection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Product_Info WHERE Product_SKU = %s;',(ProductSKU,))#This is how to execute sql commands
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({'Exception' : e}), 500            
    
@app.route('/customer', methods=['POST'])
def add_customer():
    try:
        #Getting customer info
        customer_data = request.args.to_dict()
        
        #Fields that are necessary to be filled for a customer to be added
        required_fields = ['Customer_ID', 'Gender', 'Location', 'Total_Spent', 'Tenure_Months']

        #Validating that all required fields are present in the data payload
        if not all(field in customer_data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        conn = establishConnection()
        cursor = conn.cursor()
        cursor.execute(''' INSERT INTO Customer_Info (Customer_ID, Gender, Location, Total_Spent, Tenure_Months) VALUES (%s, %s, %s, %s, %s)''',
            (
                customer_data['Customer_ID'],
                customer_data['Gender'],
                customer_data['Location'],
                customer_data['Total_Spent'],
                customer_data['Tenure_Months']
            )
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Customer added successfully"}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)