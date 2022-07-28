const mongoose = require('mongoose')
// const { Types } = require('mongoose')

function toObjectId(id) {
    return new mongoose.Types.ObjectId(id.trim())
}

function toNumber(str) {
    return parseInt(str.trim(), 10)
}

module.exports = { toObjectId, toNumber }
