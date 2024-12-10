const Exercise = require('../../models/exercise')
const express = require('express')
const { check } = require('express-validator')
const validationRequest = require('../../common/middleware/validation-request');

const router = express.Router();

const validator = [
    check('name')
        .notEmpty().withMessage('نام تمرین الزامی است.')
        .isString().withMessage('نام تمرین باید یک رشته باشد.')
        .isLength({ min: 3, max: 50 }).withMessage('نام تمرین باید بین ۳ تا ۵۰ کاراکتر باشد.'),
    
    check('duration')
        .notEmpty().withMessage('مدت زمان تمرین الزامی است.')
        .isInt({ gt: 0 }).withMessage('مدت زمان تمرین باید یک عدد مثبت باشد (به دقیقه).'),
    
    check('intensity')
        .notEmpty().withMessage('شدت تمرین الزامی است.')
        .isIn(['آسان', 'متوسط', 'دشوار']).withMessage('شدت تمرین باید یکی از مقادیر آسان، متوسط، دشوار باشد.')
];

router.post('/update/:excId', validator, validationRequest,  async(req, res, next) => {

    try {
        const { excId } = req.params;
        const { name, duration, intensity } = req.body;

        const updatedExercise = await Exercise.findByIdAndUpdate(
            excId,
            { 
            name, 
            duration, 
            intensity
            },
            { new: true, runValidators: true }
        )

        res.status(200).json({ updatedExercise })

    } catch (error) {
        next(error)
    }
    
})

module.exports = router;