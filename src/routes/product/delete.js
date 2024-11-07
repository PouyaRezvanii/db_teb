const express = require('express');
const fs = require('fs');
const path = require('path');
const Product = require('../../models/product');
const NotFoundError = require('../../common/errors/not-found-error');

const router = express.Router();

router.delete('/delete/:productId', async (req, res, next) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) {
            return next(new NotFoundError('محصول یافت نشد.'))
        }
        const imagePath = path.join(__dirname, '../../uploads/', product.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); 
        }

        await Product.findByIdAndDelete(productId);

        res.status(200).json({ message: 'محصول با موفقیت حذف شد.', product });
    } catch (error) {
        next(error);
    }
});

module.exports = router;