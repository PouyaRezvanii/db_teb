const express = require('express');

// category route
const createCategoryRoute = require('../src/routes/category/create')

const app = express()

// parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/category/',
    createCategoryRoute,
)

module.exports = app;