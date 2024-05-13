import express from 'express';
import { db } from '../server.js';
import { searchByKeyword, getDetailsByID } from '../services/api.js';

const router = express.Router();

// the /search endpoint implementation
router.get('/', async (req, res) => {
    try {
        const { query } = req;

        const collection = 'search_history';

        // Search the api and use it to create the filter
        const results = await searchByKeyword(query.searchTerm);
        const filter = { searchTerm: query.searchTerm };

        // Create the document for MongoDB
        const document = {
            searchTerm: query.searchTerm,
            searchCount: results.length,
            lastSearched: new Date()
        };

        // if its in the collection
        if (await db.has(collection, filter)) {
            // if it is update the lastSearched field
            await db.update(collection, filter, {
                lastSearched: new Date()
            });
        } else {
            // else add it to the db
            await db.create(collection, document);
        }
        // the response
        res.json(results);
    } catch (error) {
        res.status(500).json(error);
    }
});

// the /search/:id/details endpoint implementation
router.get('/:id/details', async (req, res) => {
    try {
        const { query, params } = req;
        const { id } = params;

        const collection = 'search_cache';
        // NOT _id: ObjectId
        // This is the id we use to find the details
        const filter = { id: id };

        // let because mutable
        let details = {};
        // if cache enabled
        if (query.cache) {
            // if theres actually anything
            if (await db.has(collection, filter)) {
                // get it and return
                const cursor = await db.find(collection, filter);
                details = await cursor.next();
                console.log('Details found in cache');
                res.json(details);
                return;
            } else {
                // print to verify function
                console.log('Details not found in cache');
            }
        }
        // get details from api if cache disabled or not found in cache
        details = await getDetailsByID(id);
        // remember our id is slightly different
        details['id'] = id;
        await db.create(collection, details);

        console.log('Details retrieved from API and cached');
        res.json(details);
    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;
