const express = require('express');
const { executeQuery } = require('./db')

const router = express.Router();

// Req/Res Testing
router.get('/test', async(req, res) => {
    try {
        res.json({ data: 'test' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// For customer info and transaction history
router.get('/customer', async (req, res) => {
    const { customerID } = req.query;
    try {
        const data = await executeQuery('SELECT * FROM Customers WHERE customerID = $1;', [customerID]);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// For adding new items
router.post('/admin', async (req, res) => {
    try {
        const data = await executeQuery('SELECT * FROM Customers;');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// For getting all products or searching by keyword
router.get('/shop', async (req, res) => {
    try {
        const data = await executeQuery('SELECT * FROM Customers;');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// For getting coupons and checking out
router.get('/checkout', async (req, res) => {
    try {
        const data = await executeQuery('SELECT * FROM Customers;');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get information about a specific item
router.get('/item', async (req, res) => {
    try {
        const data = await executeQuery('SELECT * FROM Customers;');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new customer
router.post('/customer', async (req, res) => {
    const { Customer_ID, Gender, Location, Total_Spent, Tenure_Months } = req.body;
    const requiredFields = ['Customer_ID', 'Gender', 'Location', 'Total_Spent', 'Tenure_Months'];

    if (!requiredFields.every((field) => req.body[field] !== undefined)) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await executeQuery(
            'INSERT INTO Customer_Info (Customer_ID, Gender, Location, Total_Spent, Tenure_Months) VALUES ($1, $2, $3, $4, $5)',
            [Customer_ID, Gender, Location, Total_Spent, Tenure_Months]
        );
        res.status(201).json({ message: 'Customer added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; // Export the router
