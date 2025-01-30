const express = require('express');
const Vendor = require('../../models/vendor')
const { check } = require('express-validator')
const validationRequest = require('../../common/middleware/validation-request');
const BadRequestError = require('../../common/errors/bad-request-error');

const router = express.Router();

const validator = [
    check('website')
        .notEmpty().withMessage('آدرس وب‌سایت الزامی است.')
        .isString().withMessage('آدرس وب‌سایت باید یک رشته باشد.')
        .isLength({ min: 5, max: 100 }).withMessage('آدرس وب‌سایت باید بین ۵ تا ۱۰۰ کاراکتر باشد.'),
    
    check('name')
        .notEmpty().withMessage('نام فروشگاه الزامی است.')
        .isString().withMessage('نام فروشگاه باید یک رشته باشد.')
        .isLength({ min: 3, max: 50 }).withMessage('نام فروشگاه باید بین ۳ تا ۵۰ کاراکتر باشد.')
];


router.post('/create',
        validator,
        validationRequest,
        async(req, res, next) => {

    try {
        const { website, name } = req.body;

        const existingVendor = await Vendor.findOne({ 
            $or: [
                { website },
                { name }
            ]
        });

        if (existingVendor) {
            return next(new BadRequestError('وبسایت با این لینک یا نام وجود دارد.'))
        }

        

        const vendor = new Vendor({
            website: website, name: name
        });

        await vendor.save();

        res.status(200).json({
            message: 'فروشنده با موفقیت ایجاد شد.',
            vendor: vendor
        });

    } catch (error) {
        return next(error)
    }

})

module.exports = router;