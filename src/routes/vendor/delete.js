const express = require('express');
const mongoose = require('mongoose'); // برای بررسی ObjectId
const Vendor = require('../../models/vendor');
const Product = require('../../models/product'); // مدل محصول را وارد کنید
const BadRequestError = require('../../common/errors/bad-request-error');

const router = express.Router();

router.delete('/delete/:vId', async (req, res, next) => {
    try {
        const { vId } = req.params;

        // بررسی صحت vId
        if (!mongoose.Types.ObjectId.isValid(vId)) {
            return next(new BadRequestError('شناسه فروشنده نامعتبر است.'));
        }

        // حذف فروشنده
        const deletedVendor = await Vendor.findByIdAndDelete(vId);

        if (!deletedVendor) return next(new BadRequestError('فروشنده یافت نشد'));

        // حذف تمام محصولات مرتبط با فروشنده
        const deletedProducts = await Product.deleteMany({ vendor: vId });

        res.status(200).json({
            message: 'فروشنده و محصولات مرتبط با آن با موفقیت حذف شدند.',
            deletedVendor,
            deletedProducts: deletedProducts.deletedCount // تعداد محصولات حذف‌شده
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
