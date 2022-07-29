const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

// some property lose
const schema = new mongoose.Schema(
    {
        id: {
            type: mongoose.Types.ObjectId,
        },
        agentId: {
            type: mongoose.Types.ObjectId,
            ref: 'agents',
            required: [true, 'review agentId is required'],
        },
        unitId: {
            type: mongoose.Types.ObjectId,
            ref: 'units',
            required: [true, 'review unitId is required'],
        },
        comment: {
            type: String,
            min: 0,
            max: 280,
            required: [true, 'review comment is required'],
        },
        rating: {
            type: Number,
            required: [true, 'review rating is required'],
            min: 1,
            max: 5,
        },
    },
    { timestamps: true }
)

schema.plugin(mongoosePaginate)
module.exports = mongoose.model('reviews', schema)
