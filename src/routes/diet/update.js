const Diet = require('../../models/diet')
const express = require('express')
const { check } = require('express-validator')
const validationRequest = require('../../common/middleware/validation-request');

const router = express.Router();

const validator = [
    check('title')
        .notEmpty().withMessage('عنوان رژیم غذایی الزامی است.')
        .isString().withMessage('عنوان رژیم غذایی باید یک رشته باشد.')
        .isLength({ min: 3, max: 100 }).withMessage('عنوان رژیم غذایی باید بین ۳ تا ۱۰۰ کاراکتر باشد.'),

    check('breakfast')
        .notEmpty().withMessage('صبحانه الزامی است.')
        .isString().withMessage('صبحانه باید یک رشته باشد.')
        .isLength({ min: 3, max: 300 }).withMessage('صبحانه باید بین ۳ تا ۳۰۰ کاراکتر باشد.'),

    check('lunch')
        .notEmpty().withMessage('ناهار الزامی است.')
        .isString().withMessage('ناهار باید یک رشته باشد.')
        .isLength({ min: 3, max: 300 }).withMessage('ناهار باید بین ۳ تا ۳۰۰ کاراکتر باشد.'),

    check('dinner')
        .notEmpty().withMessage('شام الزامی است.')
        .isString().withMessage('شام باید یک رشته باشد.')
        .isLength({ min: 3, max: 300 }).withMessage('شام باید بین ۳ تا ۳۰۰ کاراکتر باشد.'),

    check('snacks')
        .optional() // این فیلد اختیاری است
        .isString().withMessage('میان‌وعده باید یک رشته باشد.')
        .isLength({ max: 300 }).withMessage('میان‌وعده نباید بیشتر از ۳۰۰ کاراکتر باشد.')
];


router.post('/update/:dietId', validator, validationRequest, async(req, res, next) => {

    try {
        const { dietId } = req.params;
        const { title, breakfast, lunch, dinner, snacks } = req.body;

        const updatedDiet = await Diet.findByIdAndUpdate(
            dietId,
            { 
            title, 
            breakfast, 
            lunch, 
            dinner, 
            snacks
            },
            { new: true, runValidators: true }
        )

        res.status(200).json({ updatedDiet })

    } catch (error) {
        next(error)
    }

})

module.exports = router;