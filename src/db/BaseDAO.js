/**
 * Created by vlad.chirkov on 9/26/17.
 */
const EventEmitter = require('events');
const MongoClient = require('mongodb').MongoClient;

const {MONGODB_URI, DB_NAME} = process.env;

module.exports = class BaseDAO extends EventEmitter {
    constructor(collectionName) {
        super();

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        this.dao = new Promise(async (res, rej) => {
            try {
                const client = await new MongoClient(MONGODB_URI, options).connect();
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);

                await this.indexes({db, collection});

                res({db, collection});
            } catch (e) {
                rej(e);
            }
        });

        return this;
    }

    /**
     * should be overwritten to manage indexes of collection
     */
    indexes() {
    }
};
