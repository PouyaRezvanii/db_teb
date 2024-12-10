const NotFoundError = require('../../common/errors/not-found-error');
const Exercise = require('../../models/exercise')
const express = require('express')

const router = express.Router();

router.get('/all', async(req, res, next) => {

    try {
        const exercises = await Exercise.find()

        if(!exercises)  return next(new NotFoundError('هیچ تمرینی پیدا نشد.'));

        res.status(200).json({
            exercises: exercises
        });

    } catch (error) {
        next(error)
    }



})

module.exports = router;