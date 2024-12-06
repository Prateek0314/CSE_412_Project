const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

// Create a connection pool
const pool = new Pool({
    host: process.env.HOST,
    database: process.env.NAME,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});

// Export a helper function for executing queries
const executeQuery = async (query, params) => {
    const client = await pool.connect(); // Get a connection from the pool
    try {
        const result = await client.query(query, params); // Execute query
        return result.rows; // Return query result rows
    } catch (err) {
        console.error('Database query error:', err.message);
        throw err; // Rethrow error to be handled by the caller
    } finally {
        client.release(); // Release the connection back to the pool
    }
};

module.exports = {
    executeQuery, // Export query execution function
    pool, // Export the pool for advanced use cases
};
