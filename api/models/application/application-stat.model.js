const mongoose = require('mongoose')

const statisticSchema = mongoose.Schema({

    _id: mongoose.Types.ObjectId,
    serviceCode: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'new'
    },
    datePeriod: {
        type: Number,
        required: false
    },
    period: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        default: 0
    },
    count: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

statisticSchema.pre('updateOne', function (next) {

    const updated = new Date()

    const data = this.getUpdate()

    data.updated = updated
    this.update({}, data).exec()
    next()
})

module.exports = mongoose.model('statistic', statisticSchema)