const {Router} = require('express');
const {locationDAO} = require('../../db');

const router = new Router();

router.get(`/pins/:id`, async (req, res) => res.send(await locationDAO.getPin(req.params.id, req.session.user.id)));
router.get(`/pins`, async (req, res) => res.send(await locationDAO.getPinsForExtent(req.query.extent)));
router.post(`/pins/add`, async (req, res) => {
    const {type, coordinates} = req.body;
    const pin = await locationDAO.addPin({type, coordinates}, req.session.user.id);
    res.send(pin);
});
router.post(`/pins/confirm`, async ({body, session}, res) => {
    res.send(await locationDAO.confirmPin(body.id, session.user.id));
});
router.post(`/pins/reject`, async ({body, session}, res) => {
    res.send(await locationDAO.rejectPin(body.id, session.user.id));
});

module.exports = router;
