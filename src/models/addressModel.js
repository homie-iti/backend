const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        city: { type: String, required: [true, 'address city is required'] },
        streetName: {
            type: String,
            required: [true, 'address street name is required'],
        },
        buildingNumber: {
            type: Number,
            required: [true, 'address building number is required'],
        },
    },
    { _id: false }
)

module.exports = schema
