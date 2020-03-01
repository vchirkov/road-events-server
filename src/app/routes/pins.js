const {Router} = require('express');
const {locationDAO} = require('../../db');

const router = new Router();

router.get(`/pins`, async (req, res) => res.send(await locationDAO.getPins(req.query.extent)));
router.post(`/pins`, async (req, res) => {
    const {type, coordinates} = req.body;
    const pin = await locationDAO.addPin({type, coordinates}, req.session.user.id);
    res.send(pin);
});

module.exports = router;
