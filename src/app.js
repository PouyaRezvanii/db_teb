const express = require('express');

// category route
const createCategoryRoute = require('../src/routes/category/create');
const readCategoryRoute = require('../src/routes/category/read');


//error
const NotFoundError = require('./common/errors/not-found-error');
const CustomError = require('./common/errors/custom-error');

const app = express()

// parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/category/',
    createCategoryRoute,
    readCategoryRoute,
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