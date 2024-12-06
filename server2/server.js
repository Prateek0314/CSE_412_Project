const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const routes = require('./routes'); // Import the routes

app.use(cors());
app.use(express.json());

// Use the routes
app.use('/', routes); // Mount the routes

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
