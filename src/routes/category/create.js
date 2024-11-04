const express = require('express')
const Category = require('../../models/category')

const router = express.Router();

router.post('/create', async(req, res, next) => {

    try {
        const { catName } = req.body;

        if (!catName) {
            return res.status(400).json({ message: 'نام دسته‌بندی الزامی است.' });
        }

        const newCategory = new Category({
            catName: catName
        });

        await newCategory.save();

        res.status(200).json({
            message: 'دسته‌بندی با موفقیت ایجاد شد.',
            category: newCategory
        });

    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'خطا در ایجاد دسته‌بندی.' });
    }

})

module.exports = router;