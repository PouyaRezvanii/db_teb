const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const vendorSchema = new Schema({
    website: {
        type: String,
        required: true
    },
    name: {
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

module.exports = mongoose.model('Vendor', vendorSchema);