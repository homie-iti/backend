const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const addressSchema = require('./addressModel')
// some property lose
const schema = new mongoose.Schema(
    {
        // _id: {
        //   type: mongoose.Types.ObjectId,
        // },
        isLandlord: {
            type: Boolean,
            default: false,
        },

        isAccountActivated: {
            // for registration process
            type: Boolean,
            default: false,
        },

        isAgent: {
            type: Boolean,
            default: false,
        },
        fullName: {
            type: String,
            minlength: 3,
            required: [true, 'user fullName is required'],
        },
        age: {
            type: Number,
            min: 18,
            required: [true, 'user age is required'],
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'user email is required'],
            // match:{}
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: [true, 'user gender is required'],
        },
        password: {
            type: String,
            required: [true, 'user password is required'],
        },
        phone: { type: String, required: [true, 'user phone is required'] },
        national_id: {
            type: Number,
            required: [true, 'user national_id is required'],
            unique: true,
        },
        image: {
            type: String,
            default: '\\uploads\\users\\user.jpg',
        },

        address: addressSchema,

        favoriteUnits: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'units',
            },
        ],
        resetLink: {
            type: String,
            default: '',
        },
        balance: {
            type: Number,
            default: 0,
            required: [true, 'User balance is required'],
        },
    },
    { timestamps: true }
)
schema.plugin(mongoosePaginate)
module.exports = mongoose.model('users', schema)
