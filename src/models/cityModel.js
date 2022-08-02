const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const schema = new mongoose.Schema({
    cover: {
        type: String,
    },

    name: {
        type: String,
        required: [true, 'city cityName is required'],
    },
    // you need sure
    // {
    units:
        // type:
        [{ type: mongoose.Types.ObjectId, ref: 'units' }],
    // ,
    // required: [true, "city units is required"], TODO ask the team for their opinion
    // },
})

schema.plugin(mongoosePaginate)
module.exports = mongoose.model('cities', schema)
