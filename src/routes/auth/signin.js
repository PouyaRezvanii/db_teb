// src/routes/auth/signin.js
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

        const token = jwt.sign(
            { email, userId: user._id, role: user.role }, // اضافه کردن نقش
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        req.session = { token }

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
