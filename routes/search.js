import express from 'express';
import { searchByKeyword, getDetailsByID } from '../services/api.js';
import { db } from '../server.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { query } = req;

        const results = await searchByKeyword(query.searchTerm);
        const filter = { searchTerm: query.searchTerm };

        const document = {
            searchTerm: query.searchTerm,
            searchCount: results.length,
            lastSearched: new Date()
        };

        const cursor = await db.find('search_history', filter);

        if (cursor.count()) {
            await db.update('search_history', filter, {
                lastSearched: new Date()
            });
        } else {
            await db.create('search_history', document);
        }
        res.json(document);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/:id/details', async (req, res) => {
    try {
        const { query, params } = req;
        const { id } = params;

        const collection = 'search_cache';
        // NOT _id: ObjectId
        // This is the id we use to find the details
        const filter = { id: id };

        let details = {};

        if (query.cache) {
            const cursor = await db.find(collection, filter);
            if (await cursor.count()) {
                details = await cursor.next();
                console.log('Details found in cache');
                res.json(details);
                return;
            } else {
                console.log('Details not found in cache');
            }
        }

        details = await getDetailsByID(id);
        details['id'] = id;
        await db.create(collection, details);

        console.log('Details retrieved from API and cached');
        res.json(details);
    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;
