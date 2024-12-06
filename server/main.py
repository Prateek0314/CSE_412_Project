from flask import Flask, jsonify, request
import psycopg2
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)   

def establishConnection():
    conn = psycopg2.connect(
        host = os.getenv('host'),
        database = os.getenv('name'),
        user = os.getenv('user'),
        password = os.getenv('password'),
        port = os.getenv('port')        
    )
    return conn

#For customer info and transaction history
@app.route('/customer', methods=['GET'])
def get_info():
    try:
        parameters = request.json#Whatever the args that we want to call for the endpoints, creates a dict of the arguments
        if 'Customer_ID' not in parameters:
            return jsonify({"error": "Missing required fields"}), 400
        customerID = parameters['Customer_ID']
        conn = establishConnection()
        cursor = conn.cursor()
        cursor.execute(f'SELECT * FROM Customers WHERE Customer_ID = %s;',(customerID))#This is how to execute sql commands
        data = cursor.fetchall()
        cursor.execute(f'SELECT * FROM Transaction_Info WHERE Customer_ID = %s;',(customerID))
        transaction_info = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify([data,transaction_info])
    except Exception as e:
        return jsonify({'Exception' : e}), 500

#For adding new items
@app.route('/admin', methods=['POST'])
def add_items():
    try:
        item_info = request.json#Whatever the args that we want to call for the endpoints, creates a dict of the arguments
        required_fields = ['Product_SKU', 'Product_Description','Product_Category','Item_Price','Store_Quantity']
        if not all(field in item_info for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        conn = establishConnection()
        cursor = conn.cursor()
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
        shop_request = request.json#Whatever the args that we want to call for the endpoints, creates a dict of the arguments
        if not (shop_request is None or 'Product_Category' in shop_request):
            return jsonify({"error": "Missing required fields"}), 400
        conn = establishConnection()
        cursor = conn.cursor()
        if shop_request is None:
            cursor.execute('SELECT * FROM Product_Info;')#This is how to execute sql commands
        else:
            product_category = shop_request['Product_Category']
            cursor.execute('SELECT * FROM Product_Info WHERE Product_Category = %s;', product_category)#This is how to execute sql commands
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({'Exception' : e}), 500

#For getting coupons
@app.route('/fetchcoupons', methods=['GET'])
def check_out():
    try:
        parameters = request.json#Whatever the args that we want to call for the endpoints, creates a dict of the arguments
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
        transaction_data = request.json
        required_fields = ['Transaction_Info','Transaction_Detail']
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
    required_fields = ['Transaction_ID','Customer_ID','Transaction_Date','Delivery_Charge','Products','Total_Price']
    if not all(field in transaction_info for field in required_fields):
        return True
    conn = establishConnection()
    cursor = conn.cursor()
    cursor.execute(''' INSERT INTO Transaction_Info (Transaction_ID, Customer_ID, Transaction_Date, Delivery_Charge, Products, Total_Price) VALUES (%s, %s, %s, %s, %s,%s)''',
        (
            transaction_info['Transaction_ID'],
            transaction_info['Customer_ID'],
            transaction_info['Transaction_Date'],
            transaction_info['Delivery_Charge'],
            transaction_info['Products'],
            transaction_info['Total_Price']
        )
    )
    conn.commit()
    cursor.close()
    conn.close()
    return False

#Creates details for the created transaction
def create_details(transaction_detail):
    required_fields = ['Transaction_ID','Product_SKU','Coupon_Code','Tax_Pct','Purchased_Quantity']
    if not all(field in transaction_detail for field in required_fields):
        return True
    conn = establishConnection()
    cursor = conn.cursor()
    cursor.execute(''' INSERT INTO Transaction_Detail (Transaction_ID, Product_SKU, Coupon_Code, Tax_Pct, Purchased_Quantity) VALUES (%s, %s, %s, %s, %s)''',
        (
            transaction_detail['Transaction_ID'],
            transaction_detail['Product_SKU'],
            transaction_detail['Coupon_Code'],
            transaction_detail['Tax_Pct'],
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
        item_request = request.json#Whatever the args that we want to call for the endpoints, creates a dict of the arguments        
        if 'Product_SKU' not in item_request:
            return jsonify({"error": "Missing required fields"}), 400
        ProductSKU = item_request['Product_SKU']
        conn = establishConnection()
        cursor = conn.cursor()
        cursor.execute(f'SELECT * FROM Product_Info WHERE Product_SKU = %s;',ProductSKU)#This is how to execute sql commands
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
        customer_data = request.json
        
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

@app.route('/transaction', methods=['PUT'])
def update_transaction():
    try:
        transaction_data = request.json
        
        #Extracting transaction info and updates from payload
        transaction_id = transaction_data.get('Transaction_ID')
        updates = transaction_data.get('updates', {})
        
        if not transaction_id or not updates:
            return jsonify({"error": "Transaction_ID and updates are required"}), 400
        
        conn = establishConnection()
        cursor = conn.cursor()

        #Iterating through dictionary of updates
        for column, value in updates.items():

            #Dynamic query construction
            cursor.execute(
                sql.SQL("UPDATE Transaction_Info SET {} = %s WHERE Transaction_ID = %s")
                .format(sql.Identifier(column)), #Safely handle column names to prevent SQL injection
                (value, transaction_id)  #Setting the new values
            )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Transaction updated successfully"}), 200  #Success Response
    except Exception as e:
        return jsonify({'error': str(e)}), 500              #Error response

if __name__ == '__main__':
    app.run(debug=True)