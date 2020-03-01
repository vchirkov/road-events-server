const {Router} = require('express');
const {userDAO} = require('../../db');

const router = new Router();

router.use(async function (req, res, next) {
    //TODO: redo on token
    const token = req.get('authorization');
    const user = await userDAO.getUser(token);
    if (!user) {
        return res.sendStatus(401);
    }
    req.session = {...req.session, user};
    next();
});

module.exports = router;

