import express from 'express';
import { db } from '../server.js';

const router = express.Router();

// 1. Endpoint GET /history

// This endpoint retrieves data from the search_history collection in MongoDB
// This endpoint accepts and an optional query parameter:  searchTerm
// If no query parameter is provided, returns a JSON response of all search history saved in the Atlas Cloud MongoDB.
// If a query parameter is provided, returns a JSON response of the search history associated with the search term in the Atlas Cloud MongoDB.

router.get('/', async (req, res) => {
    try {
        const { query } = req;

        const collection = 'search_history';
        const filter = { searchTerm: query.searchTerm };

        let cursor;

        if (query.searchTerm) {
            cursor = await db.find(collection, filter);
        } else {
            cursor = await db.find(collection);
        }

        const result = await cursor.toArray();

        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;
