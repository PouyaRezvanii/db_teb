const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    catName: {
        type: String,
        required: true
    }
},
{
    timestamps :{
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
})

module.exports = mongoose.model('Category', categorySchema);