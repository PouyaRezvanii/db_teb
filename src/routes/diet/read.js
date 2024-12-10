const Diet = require('../../models/diet')
const express = require('express')

const router = express.Router();

router.get('/all', async(req, res, next) => {

    try {
        const diets = await Diet.find()

        if(!diets)  return next(new NotFoundError('هیچ رژیمی پیدا نشد.'));

        res.status(200).json({
            diets: diets
        });

    } catch (error) {
        next(error)
    }


})

module.exports = router;