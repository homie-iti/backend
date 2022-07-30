const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

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

schema.plugin(mongoosePaginate)
module.exports = mongoose.model('landlords', schema)
