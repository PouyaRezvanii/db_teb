const express = require('express');

const app = express()

// parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



module.exports = app;