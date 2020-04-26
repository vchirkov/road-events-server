/**
 * Created by vlad.chirkov on 9/26/17.
 */
const BaseDAO = require('./BaseDAO');
const {ObjectId} = require('mongodb');

const {
    TYPE_ACCIDENT, ACCIDENT_TTL,
    TYPE_ROAD_WORKS, ROAD_WORKS_TTL,
    TYPE_SPEED_CAM, SPEED_CAM_TTL,
    TYPE_PATROL, PATROL_TTL,
    REJECTS_NUMBER, REJECTS_TTL,
    DETECTION_RADIUS, PIN_MAX_RADIUS
} = require('../constants');

const TYPE_TTL_MAP = {
    [TYPE_ACCIDENT]: ACCIDENT_TTL,
    [TYPE_ROAD_WORKS]: ROAD_WORKS_TTL,
    [TYPE_SPEED_CAM]: SPEED_CAM_TTL,
    [TYPE_PATROL]: PATROL_TTL,
};

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
        if (!coordinates || !type) null;

        const {collection} = await this.dao;

        const [pin] = await this.getPinsForRadius(coordinates, PIN_MAX_RADIUS, type);

        if (pin) {
            return this.confirmPin(pin._id, from);
        }

        const now = Date.now();

        const insert = {
            type,
            from,
            created_at: now,
            updated_at: now,
            location: {
                type: 'Point',
                coordinates
            },
            confirms: [{from, updated_at: now}],
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

        return this.getPin(_id, from);
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
                    $each: [{
                        from,
                        updated_at
                    }]
                }
            },
        }, {
            returnOriginal: false
        });

        return this.getPin(_id, from);
    }

    async getPinsForExtent(extent) {
        if (!extent || !extent.length) return;

        const {collection} = await this.dao;
        const [left, bottom, right, top] = extent;

        return await collection
            .aggregate([
                ...this._aggregateExtent(left, bottom, right, top),
                ...this._aggregateRejected(),
                {
                    $project: {
                        type: 1,
                        location: 1
                    }
                }
            ])
            .toArray();
    }

    async getPinsForRadius(coordinates, radius = DETECTION_RADIUS, type) {
        if (!coordinates) return;

        const {collection} = await this.dao;

        return collection.aggregate(
            [
                ...this._aggregateNear(coordinates, radius),
                {
                    $match: type ? this._matchTypeTTL(type) : this._matchTTL()
                }
            ]
        ).toArray();
    }

    async getPin(_id, from) {
        if (!_id || !from) {
            return null;
        }

        const {collection} = await this.dao;
        const [pin] = await collection.aggregate([
            {$match: {_id: ObjectId(_id)}},
            {
                $addFields: {
                    confirmed: {$in: [from, '$confirms.from']},
                    rejected: {$in: [from, '$rejects.from']}
                }
            },
            {
                $unset: ['confirms', 'rejects']
            }
        ]).toArray();

        return this.relatePin(pin);
    }

    _matchBox(left, bottom, right, top) {
        return {
            location: {
                $geoWithin: {
                    $box: [
                        [Number(left), Number(bottom)],
                        [Number(right), Number(top)]
                    ]
                }
            }
        };
    }

    _aggregateNear(coordinates, maxDistance) {
        return [{
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates
                },
                distanceField: 'dist',
                maxDistance
            }
        }];
    }

    _matchTypeTTL(type) {
        const now = Date.now();

        return {
            $and: [{type, updated_at: {$gt: now - TYPE_TTL_MAP[type]}}]
        };
    }

    _matchTTL() {
        const now = Date.now();
        return {
            $or: [
                {$and: [{type: TYPE_ACCIDENT, updated_at: {$gt: now - ACCIDENT_TTL}}]},
                {$and: [{type: TYPE_ROAD_WORKS, updated_at: {$gt: now - ROAD_WORKS_TTL}}]},
                {$and: [{type: TYPE_SPEED_CAM, updated_at: {$gt: now - SPEED_CAM_TTL}}]},
                {$and: [{type: TYPE_PATROL, updated_at: {$gt: now - PATROL_TTL}}]}
            ]
        };
    }

    _aggregateExtent(left, bottom, right, top) {
        return [
            {
                $match: {
                    $and: [
                        this._matchBox(left, bottom, right, top),
                        this._matchTTL()
                    ]
                }
            }
        ];
    }

    _aggregateRejected() {
        const now = Date.now();

        return [
            {
                $set: {
                    rejects: {
                        $filter: {
                            input: '$rejects',
                            as: 'reject',
                            cond: {$gt: ['$$reject.updated_at', now - REJECTS_TTL]}
                        }
                    },
                }
            },
            {
                $set: {
                    rejected: {$gte: [{$size: '$rejects'}, REJECTS_NUMBER]}
                }
            },
            {
                $match: {
                    rejected: false
                }
            }
        ];
    }
}();
