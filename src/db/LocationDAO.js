/**
 * Created by vlad.chirkov on 9/26/17.
 */
const BaseDAO = require('./BaseDAO');
const {ObjectId} = require('mongodb');

const {
    TYPE_ACCIDENT, ACCIDENT_TTL,
    TYPE_ROAD_WORKS, ROAD_WORKS_TTL,
    TYPE_SPEED_CAM, SPEED_CAM_TTL,
    TYPE_PATROL, PATROL_TTL
} = require('../constants');

module.exports = new class LocationDAO extends BaseDAO {
    constructor(collectionName = 'locations') {
        super(collectionName);
        this.userDAO = require('./UserDAO');
    }

    indexes({collection}) {
        return Promise.all([
            collection.createIndex({location: '2dsphere'})
        ]);
    }

    async relatePin(pin) {
        if (!pin) {
            return pin;
        }
        const fromPromise = this.userDAO.getUser({id: pin.from});
        return {
            ...pin,
            from: await fromPromise
        };
    }

    async addPin({type, coordinates} = {}, from) {
        const {collection} = await this.dao;

        if (!coordinates || !type) {// todo: log
            return null;
        }

        const insert = {
            type,
            from,
            created_at: Date.now(),
            updated_at: Date.now(),
            location: {
                type: 'Point',
                coordinates: [...coordinates]
            },
            confirms: [],
            rejects: [],
            comments: []
        };

        return this.relatePin((await collection.insertOne(insert)).ops[0]);
    }

    async confirmPin(_id, from) {
        const {collection} = await this.dao;
        const updated_at = Date.now();

        await collection.findOneAndUpdate({
            _id: ObjectId(_id),
            'confirms.from': {$ne: from}
        }, {
            $set: {
                updated_at
            },
            $push: {
                confirms: {
                    from,
                    updated_at
                }
            },
        }, {
            returnOriginal: false
        });

        return this.getPin(_id);
    }

    async rejectPin(_id, from) {
        const {collection} = await this.dao;
        const updated_at = Date.now();

        await collection.findOneAndUpdate({
            _id: ObjectId(_id),
            'rejects.from': {$ne: from}
        }, {
            $set: {
                updated_at
            },
            $push: {
                rejects: {
                    from,
                    updated_at
                }
            },
        }, {
            returnOriginal: false
        });

        return this.getPin(_id);
    }

    async getPinsForExtent(extent) {
        if (!extent || !extent.length) {
            return;
        }

        const now = Date.now();
        const {collection} = await this.dao;
        const [left, bottom, right, top] = extent;

        return await collection
            .find({
                location: {
                    $geoWithin: {
                        $box: [
                            [Number(left), Number(bottom)],
                            [Number(right), Number(top)]
                        ]
                    }
                },
                $or: [
                    {$and: [{type: TYPE_ACCIDENT, updated_at: {$gt: now - ACCIDENT_TTL}}]},
                    {$and: [{type: TYPE_ROAD_WORKS, updated_at: {$gt: now - ROAD_WORKS_TTL}}]},
                    {$and: [{type: TYPE_SPEED_CAM, updated_at: {$gt: now - SPEED_CAM_TTL}}]},
                    {$and: [{type: TYPE_PATROL, updated_at: {$gt: now - PATROL_TTL}}]}
                ]
            })
            .project({
                type: 1,
                location: 1
            })
            .toArray();
    }

    async getPin(_id) {
        if (!_id) {
            return null;
        }

        const {collection} = await this.dao;

        return this.relatePin(await collection.findOne({_id: ObjectId(_id)}));
    }
}();
