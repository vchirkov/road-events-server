const {Router} = require('express');
const {userDAO} = require('../../db');

const router = new Router();

//TODO: rework for token
router.get(`/user`, async (req, res) => {
    res.send(await userDAO.getUser({token: req.get('authorization')}))
});

module.exports = router;
