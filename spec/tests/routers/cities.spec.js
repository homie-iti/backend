/* eslint-disable no-undef */
// process.env.NODE_ENV = 'test'
const mongoose = require('mongoose')

const { isValidObjectId } = require('mongoose')
const supertest = require('supertest')
const app = require('../../../src/app')

const request = supertest(app) // initiated new app connection and ran it

// describe('GET -> /cities', () => {
//     beforeAll(() => {
//         jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
//     })

//     it('expected to respond with status code 200', async () => {
//         const result = await request.get('/cities')
//         // console.log(result) // return all response object
//         expect(result.status).toEqual(200)
//     })
//     it("expected to respond with data of type 'application/json'", async () => {
//         const result = await request.get('/cities')
//         // console.log(result) // return all response object
//         expect(result.type).toBe('application/json')
//     })
//     it('expected to get all cities', async () => {
//         const result = await request.get('/cities')
//         // console.log(result)
//         // expect(result.status).toEqual(200)
//     })
// })

describe('POST -> /cities', () => {
    const newCity = {
        name: 'Cairo',
        cover: 'http://www.placeholder.com',
        units: [],
    }
    const coverMatch =
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

    let result = ''
    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
    })

    it('expected to send city name when adding new city',() => {
        expect(newCity.name).toBeTruthy()
    })

    it('expected to send city name as string',() => {
        expect(newCity.name).toBeInstanceOf(String)
    })

    it('expected to send city cover as url',() => {
        expect(newCity.cover).toMatch(coverMatch)
    })

    // it('expected to send city units as array of units',  () => {
    //     expect(city.units).toBeInstanceOf(Array)
    // })

    it('expected to respond with status code 201 and type of "application/json"', async () => {
        result = await request.post('/cities').send(newCity)
        // console.log(result)
        expect(result.status).toEqual(201)
        expect(result.type).toBe('application/json')
    })

    it('expected to respond with "city added"', async () => {
        expect(result._body.data).toEqual('city added')
    })

    // it('expected to send the id of added city', async () => {
    //     console.log(result._data) // return all response object
    //     // expect(result._body.id).toEqual()
    // })

    // afterAll(async () => {
    //     await mongoose.connection.db.dropCollection('cities')
    // })
})

// describe('DELETE -> /cities', () => {
//     const cityId = {
//         id: '62e6bc5b05d77664fa872726',
//     }

//     beforeAll(() => {
//         jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
//     })

//     it('expected to send objectId of city to delete ', () => {
//         expect(cityId.id).toBeTruthy()
//     })

//     it('expected to send valid objectId ',  () => {
//         expect(true).toBe(isValidObjectId(cityId.id))
//     })

//     it('expected to respond with status code 200 with message deleted city', async () => {
//         const result = await request.delete('/cities').send(cityId)
//         console.log(result)
//         expect(result.status).toEqual(200)
//         expect(result.type).toBe('application/json')
//         expect(result._body.message).toEqual('deleted city')
//     })

//     it('expected to respond with status code 500', async () => {
//         const result = await request.delete('/cities').send(cityId)
//         expect(result.status).toEqual(500)
//     })

//     // afterAll(async () => {
//     //     await mongoose.connection.db.dropCollection('cities')
//     // })
// })

describe('UPDATE -> /cities/:id', () => {
    const id = '62e6bc5b05d77664fa872728'

    const updatedProperty = {
        name: 'Damietta',
    }

    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
    })

    // it('expected to send objectId of city to update ', async () => {
    //     expect(cityId.id).toBeTruthy()
    // })

    it('expected to send valid objectId ', async () => {
        const result = await request.put(`/cities/${id}`)
        expect(true).toBe(isValidObjectId(id))
        console.log(result)
    })

    // afterAll(async () => {
    //     await mongoose.connection.db.dropCollection('cities')
    // })
})
