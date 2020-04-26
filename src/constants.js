module.exports = {
    PIN_MAX_RADIUS: 100,
    DETECTION_RADIUS: 200,

    TYPE_PATROL: 'patrol',
    TYPE_SPEED_CAM: 'speed_cam',
    TYPE_ACCIDENT: 'accident',
    TYPE_ROAD_WORKS: 'road_works',

    SPEED_CAM_TTL: 10 * 24 * 60 * 60 * 1000,
    ROAD_WORKS_TTL: 3 * 60 * 60 * 1000,
    PATROL_TTL: 60 * 60 * 1000,
    ACCIDENT_TTL: 30 * 60 * 1000,

    REJECTS_TTL: 60 * 60 * 1000,
    REJECTS_NUMBER: 3
};
