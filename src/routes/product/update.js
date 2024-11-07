const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Product = require('../../models/product');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/update/:productId', upload.single('image'), async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { 
            name,
            description,
            price,
            productUrl,
            categories,
            vendor
        } = req.body;

        const oldProduct = await Product.findById(productId);
        if (!oldProduct) {
            return next(new BadRequestError('محصول پیدا نشد.'));
        }

        const newImageName = req.file ? req.file.filename : oldProduct.image;

        // حذف تصویر قدیمی فقط در صورتی که تصویر جدیدی بارگذاری شده باشد
        if (req.file) {
            const oldImagePath = path.join(__dirname, '../../uploads/', oldProduct.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // به‌روزرسانی محصول با تصویر جدید یا تصویر قدیمی
        const updatedProduct = await Product.findByIdAndUpdate(productId, 
            {   
                name,
                description,
                price,
                image: newImageName, 
                productUrl,
                categories,
                vendor 
            },
            { new: true, runValidators: true } 
        );

        res.status(200).json({ updatedProduct });

    } catch (error) {
        next(error);
    }
});

module.exports = router;