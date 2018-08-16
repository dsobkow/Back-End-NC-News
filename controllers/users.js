const User = require('../models/User');

exports.getUser = (req, res, next) => {
    User.findOne(req.params)
    .then(user => {
        if (user === null) next({status: 400, message: 'Invalid username'});
        else res.status(200).send({ user })
    })
    .catch(err => {
        next(err)
    })
}