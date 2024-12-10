const express = require('express')
const Exercise = require('../../models/exercise');
const BadRequestError = require('../../common/errors/bad-request-error');

const router = express.Router();

router.delete('/delete/:excId', async(req, res, next) => {

    try {

    const { excId } = req.params;

    const deletedExercise = await Exercise.findByIdAndDelete(excId);

    if (!deletedExercise) {
        return next(new BadRequestError('تمرین پیدا نشد.'));
    }

    res.status(200).json({
        message: 'تمرین با موفقیت حذف شد.',
        deletedExercise
    });       

    } catch (error) {
        next(error)
    }

})

module.exports = router