// src/common/middleware/current-user.js
const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/not-authorized-error');

const currentUser = (req, res, next) => {
    try {

        const token =  req.session?.token;
        if (!token) {
            throw new NotAuthorizedError('Token missing');
        }

        const payload = jwt.verify(token, 'secret_key'); 
        //console.log("Payload:", payload);
        req.currentUser = payload; 
        next();
    } catch (error) {
        next(new NotAuthorizedError('Not authorized'));
    }
};

module.exports = currentUser;
