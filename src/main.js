const app = require('./app')
const mongoose = require('mongoose');

 mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    app.listen(5000, () => {
        console.log("server is up and running on port 5000")
    })


}).catch(err => {
    if(err) throw new Error('Database connection failed')
})