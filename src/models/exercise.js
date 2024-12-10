const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    name: {
        type: String,
        required: true 
    },
    duration: {
        type: Number, // minutes
        required: true 
    },
    intensity: {
        type: String,
        enum: ['آسان', 'متوسط', 'دشوار'], 
        default: 'متوسط'
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Exercise', exerciseSchema);
