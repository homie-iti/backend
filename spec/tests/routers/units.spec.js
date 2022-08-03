/* eslint-disable no-undef */
// process.env.NODE_ENV = 'test'

const supertest = require('supertest')
const app = require('../../../src/app')
const UserModel = require('../../../src/models/userModel')
const LandlordModel = require('../../../src/models/landlordModel')
const CityModel = require('../../../src/models/cityModel')
const UnitModel = require('../../../src/models/unitModel')
const { isValidObjectId } = require('mongoose')

const request = supertest(app) // initiated new app connection and ran it

describe('GET -> /units', () => {
    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
        result = await request.get('/units')
    })

    it('expected to respond with status code 200', () => {
        expect(result.status).toEqual(200)
    })
    it("expected to respond with data of type 'application/json'", () => {
        expect(result.type).toBe('application/json')
    })
    it('expected to get all units on selected page or on page one if not', () => {
        expect(result._body).toBeInstanceOf(Object)
    })
})

describe('POST & UPDATE & DELETE -> /units', () => {
    let result
    let newUser
    let newCity
    let newLandlord
    let updateUnit
    let deleteUnit
    let cityId
    let userId
    let landlordId
    let unitId

    const user = {
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
        isLandlord: true,
    }
    const city = {
        name: 'Cairo',
        cover: 'https://www.placeholder.com/200x370',
    }

    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
        newUser = await request.post('/users').send(user)
        // console.log(`User:${newUser}`)
        userId = newUser._body.data._id
        console.log(`UU:${userId}`)
        newCity = await request.post('/cities').send(city)
        // console.log(`City:${newCity}`)
        cityId = newCity._body.id
        console.log(`CC:${cityId}`)
        newLandlord = await request
            .post('/landlords')
            .send({ _id: userId, landlordUnits: [] })
        // console.log(`Landlord:${newLandlord}`)
        landlordId = newLandlord._body.id
        console.log(`LL:${landlordId}`)
    })

    describe('POST -> /units', () => {
        it('expected to respond with status code 422', async () => {
            // console.log(userId)
            newUnit = await request.post('/units').send({
                landlordId: 'ff9f0bc310cd98ffae58d930',
                cityId: '9b1a2f4d37c8b74028ded97b',
                estateType: 'single-room',
                address: {
                    city: 'Damietta',
                },
                numberOfResidents: 4,
                unitInfo: {
                    description: 'this unit is very gooood.',
                    rooms: 4,
                    bathrooms: 1,
                    floor: 1,
                },
                allowedGender: 'female',
            })
            // console.log(newUnit)
            expect(newUnit.status).toEqual(422)
        })

        it('expected to respond with message "Unit Daily Price Must Be Number / Unit Availability Must Be Added as true(available), false(unavailable)."', () => {
            expect(newUnit._body.details).toBe(
                'Unit Daily Price Must Be Number / Unit Availability Must Be Added as true(available), false(unavailable).'
            )
        })

        it('expected to respond with status code 500', async () => {
            // console.log(userId)
            newUnit = await request.post('/units').send({
                landlordId: 'ff9f0bc310cd98ffae58d930',
                cityId: '9b1a2f4d37c8b74028ded97b',
                estateType: 'single-room',
                address: {
                    city: 'Damietta',
                },
                numberOfResidents: 4,
                unitInfo: {
                    description: 'this unit is very gooood.',
                    rooms: 4,
                    bathrooms: 1,
                    floor: 1,
                },
                allowedGender: 'female',
                dailyPrice: 100,
                isAvailable: true,
                address: {
                    city: 'cairo',
                    buildingNumber: 452,
                    streetName: '14safgrgg',
                },
            })
            // console.log(newUnit)
            expect(newUnit.status).toEqual(500)
        })

        it('expected to respond with message "landlordId is not in db"', () => {
            expect(newUnit._body.details).toBe('landlordId is not in db')
        })

        it('expected to respond with status code 201 ', async () => {
            // console.log(userId)
            newUnit = await request.post('/units').send({
                landlordId,
                cityId,
                estateType: 'single-room',
                address: {
                    city: 'Damietta',
                },
                numberOfResidents: 4,
                unitInfo: {
                    description: 'this unit is very gooood.',
                    rooms: 4,
                    bathrooms: 1,
                    floor: 1,
                },
                allowedGender: 'female',
                dailyPrice: 100,
                isAvailable: true,
                address: {
                    city: 'cairo',
                    buildingNumber: 452,
                    streetName: '14safgrgg',
                },
            })
            console.log(newUnit)
            unitId = newUnit._body.id
            console.log(unitId)
            expect(newUnit.status).toEqual(201)
        })

        it('expected to respond with object containing message "added" and id of added unit', () => {
            expect(newUnit._body).toBeInstanceOf(Object)
            expect(newUnit._body.data).toBe('added')
            expect(true).toBe(isValidObjectId(newUnit._body.id))
        })
    })

    describe('DELETE -> /units/:id', () => {
        beforeAll(async () => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
        })

        it('expected to respond with status code 422 with message"Unit Id Must Be ObjectId.', async () => {
            deleteUnit = await request.delete('/units/12348')
            console.log(deleteUnit)
            expect(deleteUnit.status).toEqual(422)
            expect(deleteUnit._body.details).toBe('Unit Id Must Be ObjectId.')
        })

        it('expected to respond with status code 200 ', async () => {
            deleteUnit = await request.delete(`/units/${unitId}`)
            console.log(deleteUnit)
            expect(deleteUnit.status).toEqual(200)
        })

        it('expected to respond with message "Unit Deleted"', () => {
            expect(deleteUnit._body).toBe('Unit Deleted')
        })

        it('expected to respond with status code 500', async () => {
            deleteUnit = await request.delete(`/units/${unitId}`)
            console.log(deleteUnit)
            expect(deleteUnit.status).toEqual(500)
        })

        it('expected to respond with message "Unit Not Found"', () => {
            expect(deleteUnit._body.details).toBe('Unit Not Found')
        })
    })

    afterAll(async () => {
        await UserModel.deleteMany({})
        await LandlordModel.deleteMany({})
        await CityModel.deleteMany({})
        await UnitModel.deleteMany({})
    })
})
