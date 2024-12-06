from flask import Flask, jsonify, request
import psycopg2
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
import os
from flask_cors import CORS
from dotenv import load_dotenv

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
        parameters = request.args.to_dict()#Whatever the args that we want to call for the endpoints, creates a dict of the arguments
        customerID = parameters['customerID']

        conn = establishConnection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(f'SELECT * FROM Customers WHERE customerID = %s;',(customerID))#This is how to execute sql commands
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({'Exception' : e}), 500

#For adding new items
@app.route('/admin', methods=['POST'])
def add_items():
    try:
        parameters = request.args.to_dict()#Whatever the args that we want to call for the endpoints, creates a dict of the arguments
        conn = establishConnection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute('SELECT * FROM Customers;')#This is how to execute sql commands
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({'Exception' : e}), 500

#For getting all products or getting a product based on keyword
@app.route('/shop', methods=['GET'])
def search():
    try:
        parameters = request.args.to_dict()#Whatever the args that we want to call for the endpoints, creates a dict of the arguments
        conn = establishConnection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute('SELECT * FROM Customers;')#This is how to execute sql commands
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({'Exception' : e}), 500

#For getting coupons and checking out(removing from database and adding to the customer table)
@app.route('/checkout', methods=['GET'])
def check_out():
    try:
        parameters = request.args.to_dict()#Whatever the args that we want to call for the endpoints, creates a dict of the arguments
        conn = establishConnection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute('SELECT * FROM Customers;')#This is how to execute sql commands
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({'Exception' : e}), 500      

#Get information about specific item
@app.route('/item', methods=['GET'])
def get_item_info():
    try:
        parameters = request.args.to_dict()#Whatever the args that we want to call for the endpoints, creates a dict of the arguments
        conn = establishConnection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute('SELECT * FROM Customers;')#This is how to execute sql commands
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