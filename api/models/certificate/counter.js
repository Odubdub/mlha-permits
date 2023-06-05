const mongoose = require('mongoose')

const counterSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    count: {
        type: Number,
        default: 0
    },
    suffix: {
        type: String,
        default: 0
    }
})

module.exports = mongoose.model('Counter', counterSchema)