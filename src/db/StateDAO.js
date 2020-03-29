/**
 * Created by vlad.chirkov on 9/26/17.
 */
const BaseDAO = require('./BaseDAO');

module.exports = new class StateDAO extends BaseDAO {
    constructor(collectionName = 'states') {
        super(collectionName);
    }

    indexes({collection}) {
        return Promise.all([
            collection.createIndex({user_id: 1, chat_id: 1}),
            collection.createIndex({message_id: 1}),
            collection.createIndex({updated_at: 1})
        ]);
    }

    async setState({user_id, chat_id, message_id}, state) {
        if (!(user_id || chat_id) && !message_id || !state) {
            return null;
        }

        const {collection} = await this.dao;

        const update = {
            user_id,
            chat_id,
            name: state.name,
            data: state.data,
            updated_at: Date.now()
        };
        const options = {
            returnOriginal: false,
            upsert: true
        };

        return (await collection.findOneAndUpdate({user_id, chat_id, message_id}, {$set: update}, options)).value;
    }

    async getState({user_id, chat_id, message_id}) {
        if (!(user_id || chat_id) && !message_id) {
            return null;
        }

        const {collection} = await this.dao;

        return (await collection.findOne({user_id, chat_id, message_id})) || {};
    }
}();
