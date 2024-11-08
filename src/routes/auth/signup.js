// src/routes/auth/signup.js
const express = require('express');
const { check } = require('express-validator');
const validationRequest = require('../../common/middleware/validation-request');
const User = require('../../models/user');
const BadRequestError = require('../../common/errors/bad-request-error');
const jwt = require('jsonwebtoken')

const router = express.Router();

const validator = [
    check('email').notEmpty().withMessage('email is required!'),
    check('password').notEmpty().withMessage('password is required!'),
];

router.post('/signup', validator, validationRequest, async (req, res, next) => {
    const { email, password, role = 'user' } = req.body; // نقش پیش‌فرض user است

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new BadRequestError('User already exists');
        }

        const user = new User({ email, password, role });
        
        await user.save();

        const token = jwt.sign(
            { email, userId: user._id, role: user.role },
            'secret_key',
            { expiresIn: '1d' }
        );

        req.session = { token }

        res.status(200).json({ message: 'User signedup successfully', user });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
