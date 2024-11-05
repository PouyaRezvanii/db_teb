const express = require('express')
const Vendor = require('../../models/vendor')
const NotFoundError = require('../../common/errors/not-found-error')

const router = express.Router()

router.get('/all', async(req, res, next) => {

    try {
        const vendors = await Vendor.find()

        if(!vendors || vendors.length === 0) return next(new NotFoundError('فروشنده ای وجود ندارد'))
        
        res.status(200).json({
            vendors: vendors
        })
        
        
    } catch (error) {
        next(error)
    }

})

module.exports = router;