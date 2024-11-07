// src/common/middleware/authorize.js
const ForbiddenError = require('../errors/forbidden-error');

const authorize = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            throw new ForbiddenError('Access denied');
        }
        next();
    };
};

module.exports = authorize;
