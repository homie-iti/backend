const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const addressSchema = require('./addressModel')

const schema = new mongoose.Schema(
    {
        // _id: mongoose.Types.ObjectId,

        landlordId: {
            type: mongoose.Types.ObjectId,
            ref: 'users',
            required: [true, 'unit landlordId is required'],
        },

        agentId: { type: mongoose.Types.ObjectId, ref: 'users' },

        cityId: {
            type: mongoose.Types.ObjectId,
            ref: 'cities',
            required: [true, 'unit city is required'],
        },

        estateType: {
            type: String,
            required: [true, 'unit estateType is required'],
            enum: ['studio', 'shared-room', 'single-room', 'apartment'], // TODO we need to check if these are all the
        },

        address: {
            type: addressSchema,
            required: [true, 'unit address is required'],
        },

        dailyPrice: {
            type: Number,
            required: [true, 'unit dailyPrice is required'],
        },

        isAvailable: Boolean,

        cover: {
            type: String,
            required: [true, 'unit cover is required'],
            default: '//src//uploads//units//cover//default_cover.jpg',
        },

        // images: [{ type: String, required: [true, "unit images are required"] }],
        images: [String],

        isPetsAllowed: {
            type: Boolean,
            default: false,
        },

        numberOfResidents: {
            type: Number,
            required: [true, 'unit numberOfResidents is required'],
        },

        unitInfo: {
            description: {
                type: String,
                required: [true, 'unit unitInfo description is required'],
            },
            rooms: {
                type: Number,
                required: [true, 'unit unitInfo rooms is required'],
            },
            bathrooms: {
                type: Number,
                required: [true, 'unit unitInfo bathrooms is required'],
            },
            floor: {
                type: Number,
                required: [true, 'unit unitInfo floor is required'],
            },
        },

        allowedGender: {
            type: String,
            required: [true, 'unit gender is required'],
            enum: ['male', 'female', 'any'],
        },

        geoLocation: {
            type: {
                type: String,
                enum: ['Point'], // 'location.type' must be 'Point'
                // required: [true, "unit location is required"],
            },
            coordinates: {
                type: [Number],
                // required: [true, "unit coordinates is required"],
            },
        },
        reviews: {
            ratings: [
                {
                    type: Number,
                    min: 1,
                    max: 5,
                },
            ],
            totalReviews: [{ type: mongoose.Types.ObjectId, ref: 'reviews' }],
        },
    },
    { timestamps: true }
)

schema.plugin(mongoosePaginate)
module.exports = mongoose.model('units', schema)
