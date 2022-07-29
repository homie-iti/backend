const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const schema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
    },

    // error===>see again
    agentUnits: {
        type: [
            {
                unitId: { type: mongoose.Types.ObjectId, ref: 'units' },
                numberOfRenting: { type: Number },
            },
        ],
        _id: false,
        required: [true, 'agent units is required'],
    },
})

schema.plugin(mongoosePaginate)
module.exports = mongoose.model('agents', schema)
