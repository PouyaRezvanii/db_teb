const express = require('express');
const { check } = require('express-validator');
const validationRequest = require('../../common/middleware/validation-request');
const multer = require('multer');
const path = require('path');
const Product = require('../../models/product'); // مسیر صحیح به مدل Product
const BadRequestError = require('../../common/errors/bad-request-error');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // نام فایل
    }
});

const upload = multer({ storage });

// تعریف اعتبارسنجی‌ها
const validator = [
    check('name')
        .notEmpty().withMessage('نام محصول الزامی است.')
        .isString().withMessage('نام محصول باید یک رشته باشد.')
        .isLength({ min: 3, max: 100 }).withMessage('نام محصول باید بین ۳ تا ۱۰۰ کاراکتر باشد.'),
    
    check('description')
        .notEmpty().withMessage('توضیحات محصول الزامی است.')
        .isString().withMessage('توضیحات محصول باید یک رشته باشد.')
        .isLength({ min: 5, max: 500 }).withMessage('توضیحات محصول باید بین ۵ تا ۵۰۰ کاراکتر باشد.'),
    
    check('price')
        .notEmpty().withMessage('قیمت محصول الزامی است.')
        .isFloat({ gt: 0 }).withMessage('قیمت محصول باید یک عدد مثبت باشد.'),
    
    check('productUrl')
        .notEmpty().withMessage('آدرس محصول الزامی است.') // بررسی اینکه فیلد خالی نباشد
        .isString().withMessage('آدرس محصول باید یک URL معتبر باشد.')
        .isLength({ min: 5, max: 1000 }).withMessage('طول آدرس باید بین ۵ تا ۱۰0۰ کاراکتر باشد.'),

    check('categories')
        .custom((value) => {
            // بررسی اینکه آیا ورودی یک آرایه است یا خیر
            if (!Array.isArray(value)) {
                // اگر آرایه نیست، آن را به آرایه تبدیل کنید
                value = [value];
            }

            // بررسی اینکه آرایه خالی نباشد
            if (value.length === 0) {
                throw new Error('دسته‌بندی‌ها نمی‌توانند خالی باشند.');
            }

            return true; // اگر همه شرایط برقرار بود، true برگردانید
    }),
    
    check('vendor')
        .notEmpty().withMessage('فروشنده الزامی است.')
        .isString().withMessage('فروشنده باید یک رشته باشد.')
];

router.post('/create', 
        upload.single('image'), 
        validator, 
        validationRequest, 
        async (req, res, next) => {
    
    try {

        const { name, description, price, productUrl, categories, vendor } = req.body;
        const image = req.file ? req.file.path : null; 
        

        // ایجاد محصول جدید
        const newProduct = new Product({
            name,
            description,
            price,
            image,
            productUrl,
            categories,
            vendor
        });

        await newProduct.save();

        res.status(200).json({ message: 'محصول با موفقیت ایجاد شد.', newProduct });
    } catch (error) {
        console.error(error);
        next(new BadRequestError('خطا در ایجاد محصول.'));
    }
});

module.exports = router;