import express from 'express';
import { searchByKeyword, getDetailsByID } from '../services/api.js';
import { db } from '../server.js';

const router = express.Router();

// This endpoint should also create an entry in the search_history collection in MongoDB
// If this search term does not exist in Mongo DB then create a new document to be saved into your Mongo DB search_history Collection
// If this search term does exist in Mongo DB then update the document with the a new date for lastSearched

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
        const arr = await cursor.toArray();

        if (arr.length) {
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

// 2. Endpoint GET /search/:id/details

// This endpoint accepts a path parameter: id
// This path parameter represents the user's selection and some unique dynamic identifier that is related to your API
// This endpoint accepts an optional query parameter: cache
// This query parameter represents whether the user wants to use the cache or not

// This endpoint retrieves detailed data for the selected item based on the cache option

// If the cache option is set to false (default):
// Retrieves the selected item by identifier from your API
// Saves an entry in the search_cache collection in MongoDB
// If the cache option is set to true:
// Attempts to find the selected item in the search_cache collection in MongoDB and returns it if found.
// If the item is not found in the search_cache collection, retrieves the selected item by unique identifier from the API.
// Saves an entry in the search_cache collection in MongoDB

router.get('/:id/details', async (req, res) => {
    try {
        const { query, params } = req;
        const { id } = params;

        const details = await getDetailsByID(id);

        res.json(details);
    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;
