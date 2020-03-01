/**
 * Created by vlad.chirkov on 9/26/17.
 */
const BaseDAO = require('./BaseDAO');

const {
    TYPE_PATROL,
    TYPE_SPEED_CAM,
    TYPE_ACCIDENT,
    TYPE_ROAD_WORKS,
    PATROL_TTL,
    SPEED_CAM_TTL,
    ACCIDENT_TTL,
    ROAD_WORKS_TTL
} = require('../bot/constants');

module.exports = class LocationDAO extends BaseDAO {
    constructor(collectionName = 'locations') {
        super(collectionName);
    }

    indexes({collection}) {
        return Promise.all([
            collection.createIndex({location: '2dsphere'})
        ]);
    }

    async addPin({type, coordinates} = {}, from) {
        const {collection} = await this.dao;

        if (!coordinates || !type) {// todo: log
            return null;
        }

        const insert = {
            type,
            from,
            updated_at: Date.now(),
            location: {
                type: 'Point',
                coordinates: [...coordinates]
            },
            confirms: [],
            rejects: [],
            comments: []
        };

        return (await collection.insertOne(insert)).ops[0];
    }

    async addComment(_id, user_id, comment) {
        const {collection} = await this.dao;

        return (await collection.findOneAndUpdate({_id},
            {
                updated_at: Date.now(),
                $push: {comments: {user_id, comment}}
            }
        )).value;
    }

    async getPins(extent) {
        if (!extent || !extent.length) {// todo: log
            return;
        }

        const {collection} = await this.dao;
        const [left, bottom, right, top] = extent;

        return await collection.find({
            location: {
                $geoWithin: {
                    $box: [
                        [Number(left), Number(bottom)],
                        [Number(right), Number(top)]
                    ]
                }
            }
        }).toArray();
    }
};
