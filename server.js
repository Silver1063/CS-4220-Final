import express from 'express';
import dotenv from 'dotenv';

import search from './routes/search.js';
import history from './routes/history.js';

import { MongoDB } from './services/db.js';

// Get .env variables use them to create our MongoDB object
dotenv.config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

export const db = new MongoDB(DB_USER, DB_PASSWORD, DB_HOST, DB_NAME);

// Create the express app
const app = express();

// Setup the routes
app.get('/', (req, res) => {
    res.send('Welcome to the Launch Library 2 Server App');
});

app.use('/search', search);

app.use('/history', history);

// Configure the server
const PORT = 8888;

const server = app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
    await db.connect();
});

// Detect SIGINT to exit neatly
process.on('SIGINT', async () => {
    console.log('SIGINT detected');
    await db.close();
    server.close(() => {
        console.log('Server closed.');
    });
});
