const mongoose = require('mongoose')

const hscodeSchema = mongoose.Schema({

    _id: mongoose.Types.ObjectId,
    serviceCode: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('hscode', hscodeSchema)