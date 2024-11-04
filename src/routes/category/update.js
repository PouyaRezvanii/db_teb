const express = require('express')
const Category = require('../../models/category');
const BadRequestError = require('../../common/errors/bad-request-error');
const { check } = require('express-validator')
const validationRequest = require('../../common/middleware/validation-request');


const router = express.Router();

const validator = [
    check('catName')
        .notEmpty().withMessage('نام دسته‌بندی الزامی است.')
        .isString().withMessage('نام دسته‌بندی باید یک رشته باشد.')
        .isLength({ min: 3, max: 30 }).withMessage('نام دسته‌بندی باید بین ۳ تا ۳۰ کاراکتر باشد.')
];

router.post('/update/:catId', validator, validationRequest, async (req, res, next) => {

    try {
       
        const { catId } = req.params;
        const { catName } = req.body;
        
        const updatedCategory = await Category.findByIdAndUpdate(
            catId,
            { catName },
            { new: true, runValidators: true } 
        );

        // بررسی اینکه آیا دسته‌بندی به‌روزرسانی شده است یا خیر
        if (!updatedCategory) {
            return next(new BadRequestError('دسته‌بندی پیدا نشد.'));
        }

        res.status(200).json({ updatedCategory })
        
    } catch (error) {
        next(error)
    }

})

module.exports = router;