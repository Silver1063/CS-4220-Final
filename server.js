import express from 'express';

import { MongoDB } from './services/db.js';
import dotenv from 'dotenv';

import search from './routes/search.js';
import history from './routes/history.js';

const PORT = 8888;

const app = express();

dotenv.config();
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const db = new MongoDB(DB_USER, DB_PASSWORD, DB_HOST, DB_NAME);

app.get('/', (req, res) => {
    res.send('Welcome to the Launch Library 2 Server App');
});

app.use('/search', search);

app.use('/history', history);

const server = app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
    await db.connect();
});

process.on('SIGINT', async () => {
    console.log('SIGINT detected');
    await db.close();
    server.close(() => {
        console.log('Server closed.');
    });
});
