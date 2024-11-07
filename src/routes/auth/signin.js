// src/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const BadRequestError = require('../../common/errors/bad-request-error');

const router = express.Router();

router.post('/signin', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new BadRequestError('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, 'secret_key', { expiresIn: '1d' });
        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
