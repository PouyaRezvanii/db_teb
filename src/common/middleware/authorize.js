// src/common/middleware/authorize.js
const ForbiddenError = require('../errors/forbidden-error');

const authorize = (role) => {
    return (req, res, next) => {
        if (!req.currentUser || req.currentUser.role !== role) {
            return next(new ForbiddenError('Access denied'));
        }
        next();
    };
};

module.exports = authorize;
