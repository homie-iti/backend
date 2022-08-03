/* eslint-disable no-undef */
// process.env.NODE_ENV = 'test'

const { isValidObjectId } = require('mongoose')
const supertest = require('supertest')
const app = require('../../../src/app')
const UserModel = require('../../../src/models/userModel')
const LandlordModel = require('../../../src/models/landlordModel')

const request = supertest(app) // initiated new app connection and ran it

describe('GET -> /landlords', () => {
    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
        result = await request.get('/landlords')
    })

    it('expected to respond with status code 200', async () => {
        // console.log(result)
        expect(result.status).toEqual(200)
    })
    it("expected to respond with data of type 'application/json'", async () => {
        expect(result.type).toBe('application/json')
    })
    it('expected to get all landlords on selected page or on page one if not', async () => {
        // console.log(result)
        expect(result._body).toBeInstanceOf(Object)
    })
})

describe('POST & UPDATE & DELETE -> /landlords', () => {
    let result
    let userId
    let newLandlord
    let updateLandlord
    let deleteLandlord
    const newUser = {
        fullName: 'HayaAli',
        age: 20,
        email: 'hayaali01@gmail.com',
        gender: 'female',
        password: 'haya@123',
        phone: '01001512136417',
        national_id: 142515657744154,
        address: {
            city: 'Giza',
        },
    }
    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
        result = await request.post('/users').send(newUser)
        // console.log(result)
        userId = result._body.data._id
        // console.log(userId)
    })

    describe('POST -> /landlords', () => {
        it('expected to respond with status code 422 with message"landlord id should be MongoId / landlord Units should be an Array.', async () => {
            console.log(userId)
            newLandlord = await request
                .post('/landlords')
                .send({ _id: '1235588' })
            // console.log(newLandlord)
            expect(newLandlord.status).toEqual(422)
            expect(newLandlord._body.details).toBe(
                'landlord id should be MongoId / landlord Units should be an Array.'
            )
        })

        it('expected to respond with status code 422 with message"landlord Units should be an Array.', async () => {
            console.log(userId)
            newLandlord = await request.post('/landlords').send({ _id: userId })
            // console.log(newLandlord)
            expect(newLandlord.status).toEqual(422)
            expect(newLandlord._body.details).toBe(
                'landlord Units should be an Array.'
            )
        })

        it('expected to respond with status code 500 with message"_id is not available in users collection', async () => {
            console.log(userId)
            newLandlord = await request
                .post('/landlords')
                .send({ _id: '633df69d90def2bb55c929af', landlordUnits: [] })
            // console.log(newLandlord)
            expect(newLandlord.status).toEqual(500)
            expect(newLandlord._body.details).toBe(
                '_id is not available in users collection'
            )
        })

        it('expected to respond with status code 201', async () => {
            newLandlord = await request
                .post('/landlords')
                .send({ _id: userId, landlordUnits: [] })
            // console.log(newLandlord)
            expect(newLandlord.status).toEqual(201)
        })

        it('expected to respond with message added and id of added landlord', async () => {
            // console.log(newLandlord)
            expect(newLandlord._body.data).toEqual('added')
            expect(true).toEqual(isValidObjectId(newLandlord._body.id))
        })
    })
    describe('UPDATE -> /landlords', () => {
        beforeAll(async () => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
        })

        it('expected to respond with status code 422 with message"landlord id should be MongoId / landlord Units should be MongoId.', async () => {
            console.log(userId)
            updateLandlord = await request
                .put('/landlords')
                .send({ id: '1235588' })
            // console.log(newLandlord)
            expect(updateLandlord.status).toEqual(422)
            expect(updateLandlord._body.details).toBe(
                'landlord id should be MongoId / landlord Units should be MongoId.'
            )
        })

        it('expected to respond with status code 422 with message"landlord Units should be MongoId.', async () => {
            console.log(userId)
            updateLandlord = await request
                .put('/landlords')
                .send({ id: newLandlord._body.id })
            // console.log(newLandlord)
            // console.log(updateLandlord)

            expect(updateLandlord.status).toEqual(422)
            expect(updateLandlord._body.details).toBe(
                'landlord Units should be MongoId.'
            )
        })

        it('expected to respond with status code 200', async () => {
            console.log(userId)
            updateLandlord = await request.put('/landlords').send({
                id: newLandlord._body.id,
                landlordUnits: ['633df69d90def2bb55c929af'],
            })
            // console.log(newLandlord)
            // console.log(updateLandlord)

            expect(updateLandlord.status).toEqual(200)
            expect(updateLandlord._body.landlordUnits).toBeInstanceOf(Array)
        })

        it('expected to respond with array of landlord units & its id', async () => {
            expect(true).toEqual(isValidObjectId(updateLandlord._body._id))
            expect(updateLandlord._body.landlordUnits).toBeInstanceOf(Array)
        })
    })

    describe('DELETE -> /landlords/:id', () => {
        beforeAll(async () => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
        })

        it('expected to respond with status code 422 with message"landlord id should be objectID', async () => {
            deleteLandlord = await request.delete('/landlords/12348')
            // console.log(deleteLandlord)
            expect(deleteLandlord.status).toEqual(422)
            expect(deleteLandlord._body.details).toBe(
                'landlord id should be objectID.'
            )
        })

        it('expected to respond with status code 500 with message"LandLord is not defined', async () => {
            deleteLandlord = await request.delete(
                '/landlords/62ca58a0dccdf0b5c606d593'
            )
            // console.log(deleteLandlord)
            expect(deleteLandlord.status).toEqual(500)
            expect(deleteLandlord._body.details).toBe('LandLord is not defined')
        })

        it('expected to respond with status code 200', async () => {
            deleteLandlord = await request.delete(
                `/landlords/${newLandlord._body.id}`
            )
            // console.log(deleteLandlord)
            expect(deleteLandlord.status).toEqual(200)
        })

        it('expected to respond message "deleted landlord"', async () => {
            expect(deleteLandlord._body.data).toEqual('deleted landlord')
        })
    })

    afterAll(async () => {
        await UserModel.deleteMany({})
        await LandlordModel.deleteMany({})
    })
})
