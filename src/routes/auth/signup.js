// src/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const BadRequestError = require('../../common/errors/bad-request-error');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
    const { email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new BadRequestError('User already exists');
        }

        const user = new User({ email, password, role });
        await user.save();

        const token = jwt.sign({ userId: user._id, role: user.role }, 'secret_key', { expiresIn: '1d' });
        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
