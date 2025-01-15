const express = require('express');
const Product = require('../../models/product');
const NotFoundError = require('../../common/errors/not-found-error');

const router = express.Router();

router.get('/all', async (req, res, next) => {
    try {
        const { category, sortPrice, search } = req.query; 

        let filter = {};

        if (category) {
            filter.categories = category;
        }

        if (search) {
            filter.name = { $regex: search, $options: 'i' }; // جستجوی نام محصول با حساسیت به حروف کوچک و بزرگ
        }

        let sort = {};

        if (sortPrice) {
            sort.price = sortPrice === 'asc' ? 1 : -1; // 1 برای صعودی، -1 برای نزولی
        }

        const products = await Product.find(filter).sort(sort);
        // .populate('categories').populate('vendor');

        if (!products || products.length === 0) {
            return next(new NotFoundError('محصولی وجود ندارد'));
        }

        res.status(200).json({
            products: products,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
