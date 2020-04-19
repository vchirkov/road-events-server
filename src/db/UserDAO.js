/**
 * Created by vlad.chirkov on 9/26/17.
 */
const {ObjectId} = require('mongodb');
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

    async generateToken({id}) {
        if (!id) {
            return null;
        }

        const {collection} = await this.dao;

        const user = (await collection.findOneAndUpdate(
            {id},
            {$set: {token: ObjectId()}},
            {returnOriginal: false}
        )).value;

        return user && user.token && user.token.toString();
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
            upsert: true,
            projection: {
                token: 0
            }
        };

        return (await collection.findOneAndUpdate({id}, {$set: update}, options)).value;
    }

    async getUser({id, token}) {
        if (!id && !token) {
            return null;
        }

        const {collection} = await this.dao;

        const filter = token ? {token: ObjectId(token)} : {id: parseInt(id, 10)};

        return (await collection.findOne(
            filter,
            {projection: {token: false}}
        ));
    }
}();
