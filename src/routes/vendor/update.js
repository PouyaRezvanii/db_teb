const express = require('express');
const Vendor = require('../../models/vendor');
const { check } = require('express-validator')
const validationRequest = require('../../common/middleware/validation-request');
const BadRequestError = require('../../common/errors/bad-request-error');

const router = express.Router();

const validator = [
    check('website')
        .notEmpty().withMessage('آدرس وب‌سایت الزامی است.')
        .isString().withMessage('آدرس وب‌سایت باید یک رشته باشد.')
        .isLength({ min: 5, max: 100 }).withMessage('آدرس وب‌سایت باید بین ۵ تا ۱۰۰ کاراکتر باشد.')
        .isURL().withMessage('آدرس وب‌سایت باید یک URL معتبر باشد.'),
    
    check('name')
        .notEmpty().withMessage('نام فروشنده الزامی است.')
        .isString().withMessage('نام فروشنده باید یک رشته باشد.')
        .isLength({ min: 3, max: 50 }).withMessage('نام فروشنده باید بین ۳ تا ۵۰ کاراکتر باشد.')
];

router.post('/update/:vId', 
        validator, 
        validationRequest, 
        async(req, res, next) => {

    try {
        
        const { vId } = req.params;
        const { website, name } = req.body

        const updatedVendor = await Vendor.findByIdAndUpdate(vId,
            { website, name },
            {new: true, runValidators: true}
        )

        if (!updatedVendor) {
            return next(new BadRequestError('فروشنده پیدا نشد.'));
        }

        res.status(200).json({ updatedVendor })

    } catch (error) {
        next(error)
    }

})

module.exports = router;