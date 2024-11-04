const express = require('express')
const Category = require('../../models/category')
const { check, validationResult } = require('express-validator')
const validationRequest = require('../../common/middleware/validation-request');
const BadRequestError = require('../../common/errors/bad-request-error');

const router = express.Router();

const validator = [
    check(['catName'])
    .notEmpty()
    .withMessage('نام دسته‌بندی الزامی است.')
    .isString()
    .withMessage('نام دسته بندی باید یک رشته باشد.')
    .isLength({ min: 3, max: 30 })
    .withMessage('نام دسته‌بندی باید بین ۳ تا ۳۰ کاراکتر باشد.')
]

router.post('/create',
        validator,
        validationRequest,         // بررسی خطاهای اعتبارسنجی
        async(req, res, next) => {

    try {
        // بررسی خطاهای اعتبارسنجی
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }

        const { catName } = req.body;

        // بررسی وجود دسته‌بندی با نام مشابه
        const existingCategory = await Category.findOne({ catName });
        if (existingCategory) {
            //return res.status(400).json({ message: 'دسته‌بندی با این نام قبلاً وجود دارد.' });
            return next(new BadRequestError('دسته‌بندی با این نام وجود دارد.'))
        }

        const newCategory = new Category({
            catName: catName
        });

        await newCategory.save();

        res.status(200).json({
            message: 'دسته‌بندی با موفقیت ایجاد شد.',
            category: newCategory
        });

    } 
    catch (error) {
        return next(error)
    }

})

module.exports = router;