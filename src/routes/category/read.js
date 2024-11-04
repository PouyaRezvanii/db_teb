const express = require('express');
const Category = require('../../models/category')

const router = express.Router();

router.get('/all', async(req, res, next) => {
    try {

        const categories = await Category.find()

        if (!categories || categories.length === 0) {
            return next(new NotFoundError('هیچ دسته‌بندی‌ای پیدا نشد.'));
        }

        res.status(200).json({
            categories: categories
        });
        
    } catch (error) {
        next(error)
    }
})

module.exports = router;