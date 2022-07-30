const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const schema = new mongoose.Schema(
    {
        _id: mongoose.Types.ObjectId,
        landlordId: {
            type: mongoose.Types.ObjectId,
            ref: 'landlords',
            required: [true, 'contract landlordId is required'],
        },
        agentId: {
            type: mongoose.Types.ObjectId,
            ref: 'agents',
            required: [true, 'contract agentId is required'],
        },

        unitId: {
            type: mongoose.Types.ObjectId,
            ref: 'units',
            required: [true, 'contract unitId is required'],
        },

        rentalStart: {
            type: Date,
            required: [true, 'contract rentalStart is required'],
        },
        rentalEnd: {
            type: Date,
            required: [true, 'contract rentalEnd is required'],
        },
        paymentAmount: {
            type: Number,
            required: [true, 'contract paymentAmount is required'],
        },
        // contractType: {},
        paymentMethod: {
            type: String,
            enum: ['paypal', 'bank', 'cash'],
            required: [true, 'contract paymentMethod is required'],
        },
        totalAmount: {
            type: Number,
            required: [true, 'contract totalAmount is required'],
        },
        offerPercentage: {
            type: Number,
            required: [true, 'contract offerPercentage is required'],
        },
    },
    { timestamps: true }
)

schema.plugin(mongoosePaginate)
module.exports = mongoose.model('contracts', schema)
