import { MongoClient } from 'mongodb';

/**
 * Class representing a MongoDB database connection and interactions
 */
export class MongoDB {
    /**
     * constructor
     * Loads a .env, initializes a MongoDB connection URL using environment variables,
     * and sets up properties for the MongoDB client and database
     */
    constructor(db_user, db_password, db_host, db_name) {
        this.mongoURL = `mongodb+srv://${db_user}:${db_password}@${db_host}/${db_name}?retryWrites=true&w=majority&appName=Cluster0`;
    }

    /**
     * Opens a connection to the MongoDB database
     */
    async connect() {
        try {
            this.client = new MongoClient(this.mongoURL);
            await this.client.connect();
            this.db = this.client.db();

            console.log('Connected to MongoDB');
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Closes the connection to the MongoDB database.
     */
    async close() {
        try {
            await this.client.close();

            console.log('Closed connection to MongoDB');
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Creates a new document in the specified collection
     * @param {string} collectionName - the name of the collection
     * @param {Object} data - the data to be inserted into the collection
     * @returns {Promise<Object>} - a Promise that resolves with the acknowledgement document
     */
    async create(collectionName, data) {
        try {
            const collection = this.db.collection(collectionName);
            const result = await collection.insertOne(data);
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Finds documents by their _id in the specified collection
     * @param {string} collectionName - the name of the collection
     * @param {Object} filter - the the filter used to find the document
     * @returns {Promise<Cursor>} - a Promise that resolves with the cursor
     */
    async find(collectionName, filter = {}) {
        try {
            const collection = this.db.collection(collectionName);
            const result = await collection.find(filter);
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Checks if collection contains at least one document that matches the filter
     * @param {string} collectionName - the name of the collection
     * @param {Object} filter - the the filter used to find the document
     * @returns {Promise<Boolean>} - a Promise that resolves with the cursor
     */
    async has(collectionName, filter = {}) {
        try {
            const collection = this.db.collection(collectionName);
            const result = (await collection.countDocuments(filter)) > 0;
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Finds documents by their _id in the specified collection
     * @param {string} collectionName - the name of the collection
     * @param {string} _id - the _id of the document to find
     * @param {Object} data - the data to be inserted into the collection
     * @returns {Promise<Cursor>} - a Promise that resolves with the cursor
     */
    async update(collectionName, filter, data) {
        try {
            const collection = this.db.collection(collectionName);
            const result = await collection.updateOne(filter, { $set: data });
            return result;
        } catch (err) {
            console.error(err);
        }
    }
}
