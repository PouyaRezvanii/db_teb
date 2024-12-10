const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dietSchema = new Schema({
    title: {
        type: String,
        required: true, 
        trim: true
    },
    breakfast: {
        type: String, 
        required: true
    },
    lunch: {
        type: String, 
        required: true
    },
    dinner: {
        type: String, 
        required: true
    },
    snacks: {
        type: String, 
        default: '' 
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Diet', dietSchema);
