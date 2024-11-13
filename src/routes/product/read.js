const express = require('express')
const Product = require('../../models/product');
const NotFoundError = require('../../common/errors/not-found-error');

const router = express.Router();

router.get('/all', async (req, res, next) => {
    try {
        const { category, sortPrice } = req.query;
        
        // شیء فیلتر برای نگهداری شرایط جستجو
        let filter = {};

        // اعمال فیلتر دسته‌بندی در صورت ارسال پارامتر
        if (category) {
            filter.categories = category;
        }

        // شیء مرتب‌سازی
        let sort = {};

        // اعمال مرتب‌سازی قیمت در صورت ارسال پارامتر
        if (sortPrice) {
            sort.price = sortPrice === 'asc' ? 1 : -1; // 1 برای صعودی، -1 برای نزولی
        }

        // دریافت محصولات با فیلترها و مرتب‌سازی اختیاری
        const products = await Product.find(filter).sort(sort)
        // .populate('categories').populate('vendor');

        if (!products) {
            return next(new NotFoundError('محصولی وجود ندارد'));
        }

        res.status(200).json({
            products: products
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;

router.get('/:productId', async(req, res, next) => {
    
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if(!product){
            return next(new NotFoundError('محصول یافت نشد'))
        }

        res.status(200).json({
            product: product
        })
    } catch (error) {
        next(error)
    }

})

module.exports = router;