const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
    },
    landlordUnits: {
        type: [{ type: mongoose.Types.ObjectId, ref: 'units' }],
        required: [true, 'landlord landlordUnits is required'],
    },
})
module.exports = mongoose.model('landlords', schema)
