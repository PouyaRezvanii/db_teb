const express = require('express')
const Vendor = require('../../models/vendor');
const BadRequestError = require('../../common/errors/bad-request-error');

const router = express.Router();

router.delete('/delete/:vId', async(req, res, next) => {

    try {
        
        const { vId } = req.params;

        const deletedVendor = await Vendor.findByIdAndDelete(vId)

        if(!deletedVendor) return next(new BadRequestError('فروشنده یافت نشد'))

        res.status(200).json({
            message: 'فروشنده با موفقیت حذف شد.',
            deletedVendor
        })

    } catch (error) {
        next(error)
    }

})

module.exports = router;