const app = require('./app')
const mongoose = require('mongoose');


 mongoose.connect('mongodb+srv://admin:NyUMADRXCZVKlijk@cluster0.chmto.mongodb.net/db_teb?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    app.listen(5000, () => {
        console.log("server is up and running on port 5000")
    })


}).catch(err => {
    if(err) throw new Error('Database connection failed')
})