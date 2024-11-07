// src/common/middleware/auth.js
const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/not-authorized-error');

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new NotAuthorizedError('Authorization header missing');

    const token = authHeader.split(' ')[1];
    if (!token) throw new NotAuthorizedError('Token missing');

    try {
        const payload = jwt.verify(token, 'secret_key');
        req.user = payload;
        next();
    } catch (error) {
        throw new NotAuthorizedError('Invalid token');
    }
};

module.exports = auth;
