const mongoose = require('mongoose')

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

module.exports = mongoose.model('agents', schema)
