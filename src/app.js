const express = require('express');

// auth route
// const signupRoute = require('../src/routes/auth/signup');
// const signinRoute = require('../src/routes/auth/signin');

// category route
const createCategoryRoute = require('../src/routes/category/create');
const readCategoryRoute = require('../src/routes/category/read');
const updateCategoryRoute = require('../src/routes/category/update');
const deleteCategoryRoute = require('../src/routes/category/delete');

// vendor Route
const createVendorRoute = require('../src/routes/vendor/create')
const readVendorRoute = require('../src/routes/vendor/read')
const updateVendorRoute = require('../src/routes/vendor/update')
const deleteVendorRoute = require('../src/routes/vendor/delete')

// product route
const createProductRoute = require('../src/routes/product/create')
const readProductRoute = require('../src/routes/product/read')
const updateProductRoute = require('../src/routes/product/update')
const deleteProductRoute = require('../src/routes/product/delete')


//error
const NotFoundError = require('./common/errors/not-found-error');
const CustomError = require('./common/errors/custom-error');

// Middlewares
// const auth = require('./common/middleware/auth');         // Middleware احراز هویت
// const authorize = require('./common/middleware/authorize'); // Middleware سطح دسترسی

// cookie
const cookieSession = require('cookie-session');


const app = express()

// parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use(
//     cookieSession({
//         name: 'session',
//         keys: ['secret_key'], // کلید پیش‌فرض برای رمزگذاری کوکی‌ها
//         maxAge: 24 * 60 * 60 * 1000, // زمان انقضای کوکی: 24 ساعت
//         secure: false, // استفاده از کوکی امن (HTTPS) در حالت غیرفعال
//         httpOnly: true // فقط در سمت سرور قابل دسترسی است
//     })
// );

// app.use('/auth',
//     signupRoute,
//     signinRoute
// )

app.use('/category/',
    createCategoryRoute,
    readCategoryRoute,
    updateCategoryRoute,
    deleteCategoryRoute
)

app.use('/vendor/',
    readVendorRoute,
    createVendorRoute,
    updateVendorRoute,
    deleteVendorRoute
)

app.use('/product/',
    createProductRoute,
    readProductRoute,
    updateProductRoute,
    deleteProductRoute
)

// محدود کردن دسترسی برای ایجاد، ویرایش و حذف مسیرها فقط برای ادمین
// app.use('/category/create', authorize('admin'), createCategoryRoute);
// app.use('/category/update', authorize('admin'), updateCategoryRoute);
// app.use('/category/delete', authorize('admin'), deleteCategoryRoute);

// app.use('/vendor/create', authorize('admin'), createVendorRoute);
// app.use('/vendor/update', authorize('admin'), updateVendorRoute);
// app.use('/vendor/delete', authorize('admin'), deleteVendorRoute);

// app.use('/product/create', authorize('admin'), createProductRoute);
// app.use('/product/update', authorize('admin'), updateProductRoute);
// app.use('/product/delete', authorize('admin'), deleteProductRoute);

// 404 not found
app.all("*", (req, res, next) => {
    next(new NotFoundError())
})

// error handling . . .
app.use((err, req, res, next) => {
        console.log(err)
    if(err instanceof CustomError){
        res.status(err.statusCode).json({errors : err.generateErrors()})
    }

    res.status(500).json({errors: [{message: 'something went wrong'}]})
})

module.exports = app;