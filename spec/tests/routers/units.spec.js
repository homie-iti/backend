/* eslint-disable no-undef */
// process.env.NODE_ENV = 'test'

const supertest = require('supertest')
const app = require('../../../src/app')
const UserModel = require('../../../src/models/userModel')
const LandlordModel = require('../../../src/models/landlordModel')
const CityModel = require('../../../src/models/cityModel')

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
                dailyPrice: 100,
                isAvailable: true,
            })
            console.log(newUnit)
            expect(newUnit.status).toEqual(422)
        })

        // it('expected to respond with message "user gender is not valid / userAddress is not valid / userEmail is not valid / userPhone should be characters." ', async () => {
        //     expect(newUser._body.details).toBe(
        //         'user gender is not valid / userAddress is not valid / userEmail is not valid / userPhone should be characters.'
        //     )
        // })

        // it('expected to respond with status code 500 with message "national_id: user national_id is required" ', async () => {
        //     // console.log(userId)
        //     newUser = await request.post('/users').send({
        //         email: 'billa@bvn.vbn',
        //         password: 'Asdqwe@12',
        //         age: 20,
        //         fullName: 'billa',
        //         gender: 'female',
        //         phone: '01211483907',
        //         address: {
        //             city: 'Alex',
        //         },
        //     })
        //     console.log(newUser)
        //     expect(newUser.status).toEqual(500)
        //     expect(newUser._body.details).toBe(
        //         'users validation failed: national_id: user national_id is required'
        //     )
        // })

        // it('expected to respond with status code 201 ', async () => {
        //     // console.log(userId)
        //     newUser = await request.post('/users').send({
        //         email: 'billa@bvn.vbn',
        //         password: 'Asdqwe@12',
        //         age: 20,
        //         fullName: 'billa',
        //         gender: 'female',
        //         phone: '01211483907',
        //         national_id: 142515657722154,
        //         address: {
        //             city: 'Alex',
        //         },
        //     })
        //     console.log(newUser)
        //     expect(newUser.status).toEqual(201)
        // })

        // it('expected to respond with object containing the data of user added', () => {
        //     expect(newUser._body.data).toBeInstanceOf(Object)
        // })

        // it('expected to respond with status code 500 ', async () => {
        //     // console.log(userId)
        //     newUser = await request.post('/users').send({
        //         email: 'billa@bvn.vbn',
        //         password: 'Asdqwe@12',
        //         age: 20,
        //         fullName: 'billa',
        //         gender: 'female',
        //         phone: '01211483907',
        //         national_id: 142515657722154,
        //         address: {
        //             city: 'Alex',
        //         },
        //     })
        //     console.log(newUser)
        //     expect(newUser.status).toEqual(500)
        // })

        // it('expected to respond with message "E11000 duplicate key error collection: HomieTestDB.users index: email_1 dup key: { email: "billa@bvn.vbn" }"', () => {
        //     expect(newUser._body.details).toBe(
        //         'E11000 duplicate key error collection: HomieTestDB.users index: email_1 dup key: { email: "billa@bvn.vbn" }'
        //     )
        // })
    })

    //     describe('UPDATE -> /users', () => {
    //         beforeAll(async () => {
    //             jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
    //         })

    //         it('expected to respond with status code 500 with message"User not allowed', async () => {
    //             updateUser = await request.put('/users').send({ id: '1235588' })
    //             // console.log(updateUser)
    //             expect(updateUser.status).toEqual(500)
    //             expect(updateUser._body.details).toBe('User not allowed')
    //         })

    //         it('expected to respond with status code 500 with message"Cast to ObjectId failed for value "1235588" (type string) at path "_id" for model "users"', async () => {
    //             console.log(userId)
    //             updateUser = await request.put('/users').send({ _id: '1235588' })
    //             expect(updateUser.status).toEqual(500)
    //             expect(updateUser._body.details).toBe(
    //                 'Cast to ObjectId failed for value "1235588" (type string) at path "_id" for model "users"'
    //             )
    //         })

    //         it('expected to respond with status code 500 ', async () => {
    //             console.log(userId)
    //             updateUser = await request.put('/users').send({
    //                 _id: 'dc7daf3e33aec47b4ceed988',
    //                 fullName: 'loooka',
    //             })
    //             console.log(updateUser)
    //             expect(updateUser.status).toEqual(500)
    //         })

    //         it('expected to respond with message "User not found" ', () => {
    //             expect(updateUser._body.details).toEqual('User not found')
    //         })

    //         it('expected to respond with status code 200 ', async () => {
    //             console.log(userId)
    //             updateUser = await request
    //                 .put('/users')
    //                 .send({ _id: userId, fullName: 'biko hiko' })
    //             // console.log(updateUser)
    //             expect(updateUser.status).toEqual(200)
    //         })

    //         it('expected to respond with message updated ', () => {
    //             expect(updateUser._body).toEqual('updated')
    //         })
    //     })

    //     describe('DELETE -> /users/:id', () => {
    //         beforeAll(async () => {
    //             jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
    //         })

    //         it('expected to respond with status code 500 with message"Cast to ObjectId failed for value "12348" (type string) at path "_id" for model "users"', async () => {
    //             deleteUser = await request.delete('/users/12348')
    //             console.log(deleteUser)
    //             expect(deleteUser.status).toEqual(500)
    //             expect(deleteUser._body.details).toBe(
    //                 'Cast to ObjectId failed for value "12348" (type string) at path "_id" for model "users"'
    //             )
    //         })

    //         it('expected to respond with status code 500 with message"userID not found', async () => {
    //             deleteUser = await request.delete('/users/62ca58a0dccdf0b5c606d593')
    //             // console.log(deleteLandlord)
    //             expect(deleteUser.status).toEqual(500)
    //             expect(deleteUser._body.details).toBe('userID not found')
    //         })

    //         it('expected to respond with status code 200', async () => {
    //             deleteUser = await request.delete(`/users/${userId}`)
    //             console.log(deleteUser)
    //             expect(deleteUser.status).toEqual(200)
    //         })

    //         it('expected to respond message "deleted user"', () => {
    //             expect(deleteUser._body.data).toEqual('deleted user')
    //         })

    //         it('expected to respond with status code 500 with message "userID not found"', async () => {
    //             deleteUser = await request.delete(`/users/${userId}`)
    //             console.log(deleteUser)
    //             expect(deleteUser.status).toEqual(500)
    //             expect(deleteUser._body.details).toEqual('userID not found')
    //         })
    //     })

    afterAll(async () => {
        await UserModel.deleteMany({})
        await LandlordModel.deleteMany({})
        await CityModel.deleteMany({})
    })
})
