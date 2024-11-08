const express = require('express');

// auth route
const signupRoute = require('../src/routes/auth/signup');
const signinRoute = require('../src/routes/auth/signin');

// current user
const currentUser = require('../src/common/middleware/current-user');
const authorize = require('../src/common/middleware/authorize');

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


// cookie
const cookieSession = require('cookie-session');


const app = express()

app.set('trust_proxy', true);

// parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieSession({
        signed: false,
        secure: false
    })
);

app.use('/auth',
    signupRoute,
    signinRoute
)

app.use('/category/',
    readCategoryRoute,
    currentUser,
    authorize('admin'),
    createCategoryRoute,   
    updateCategoryRoute,
    deleteCategoryRoute
)

app.use('/vendor/',
    readVendorRoute,
    currentUser,
    authorize('admin'),
    createVendorRoute,
    updateVendorRoute,
    deleteVendorRoute
)

app.use('/product/',
    readProductRoute,
    currentUser,
    authorize('admin'),
    createProductRoute,
    updateProductRoute,
    deleteProductRoute
)


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