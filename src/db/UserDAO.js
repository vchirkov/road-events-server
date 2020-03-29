/**
 * Created by vlad.chirkov on 9/26/17.
 */
const BaseDAO = require('./BaseDAO');

module.exports = new class UserDAO extends BaseDAO {
    constructor(collectionName = 'users') {
        super(collectionName);
    }

    indexes({collection}) {
        return Promise.all([
            collection.createIndex({id: 1}),
            collection.createIndex({username: 1})
        ]);
    }

    async setUser({id, username, language_code}) {
        if (!id) {
            return null;
        }

        const {collection} = await this.dao;

        const update = {
            id,
            username,
            language_code,
            updated_at: Date.now()
        };
        const options = {
            returnOriginal: false,
            upsert: true
        };

        return (await collection.findOneAndUpdate({id}, {$set: update}, options)).value;
    }

    async getUser(id) {
        if (!id) {
            return null;
        }

        const {collection} = await this.dao;

        return (await collection.findOne({id: parseInt(id, 10)}));
    }
}();
