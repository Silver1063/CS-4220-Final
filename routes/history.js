import express from 'express';
import { db } from '../server.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { query } = req;

        // Set the collection and create a filter for finding the document
        const collection = 'search_history';
        const filter = { searchTerm: query.searchTerm };

        // let because mutable
        let cursor;

        // if searchTerm not provided find everything, else use the filter
        if (query.searchTerm) {
            cursor = await db.find(collection, filter);
        } else {
            cursor = await db.find(collection);
        }

        // turn the cursor into an array
        const result = await cursor.toArray();

        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;
