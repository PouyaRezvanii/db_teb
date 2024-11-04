const express = require('express')
const Category = require('../../models/category');
const BadRequestError = require('../../common/errors/bad-request-error');

const router = express.Router();

router.delete('/delete/:catId', async(req, res, next) => {

    try {

    const { catId } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(catId);

    if (!deletedCategory) {
        return next(new BadRequestError('دسته‌بندی پیدا نشد.'));
    }

    res.status(200).json({
        message: 'دسته‌بندی با موفقیت حذف شد.',
        deletedCategory
    });       

    } catch (error) {
        next(error)
    }

})

module.exports = router