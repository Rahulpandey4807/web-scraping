const express = require('express');
const path = require('path');
const cors = require('cors');
const { fetchResult } = require('./scraper');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the frontend folder
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// API endpoint
app.post('/fetch-results', async (req, res) => {
    const { startRoll, endRoll, semester } = req.body;

    // Validate input
    if (!startRoll || !endRoll || isNaN(semester)) {
        return res.status(400).json({ error: 'Invalid input.' });
    }

    try {
        const results = {};

        // Fetch results for each roll number in the range and the specified semester
        for (let roll = startRoll; roll <= endRoll; roll++) {
            const result = await fetchResult(roll, semester);
            results[roll] = result;
        }

        res.json(results);
    } catch (error) {
        console.error('Error in /fetch-results:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching results.' });
    }
});

// Serve the frontend's index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:5000`);
});