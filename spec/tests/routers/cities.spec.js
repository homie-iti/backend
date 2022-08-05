/* eslint-disable no-undef */
// process.env.NODE_ENV = 'test'

const { isValidObjectId } = require('mongoose')
const supertest = require('supertest')
const app = require('../../../src/app')
const City = require('../../../src/models/cityModel')

const request = supertest(app) // initiated new app connection and ran it

describe('GET -> /cities', () => {
    let result = ''
    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
        result = await request.get('/cities')
        console.log(result)
    })

    it('expected to respond with status code 200', async () => {
        expect(result.status).toEqual(200)
    })
    it("expected to respond with data of type 'application/json'", async () => {
        expect(result.type).toBe('application/json')
    })
    it('expected to return array of all existed cities', async () => {
        console.log(result)
        expect(result._body).toBeInstanceOf(Array)
    })
})

describe('POST -> /cities', () => {
    const newCity = {
        name: 'Cairo',
        cover: 'https://www.placeholder.com/200x370',
    }
    const coverMatch =
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

    let result = ''
    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
    })

    it('expected to send name as string when adding new city and city cover as url', async () => {
        result = await request.post('/cities').send(newCity)
        expect(newCity.name).toBeTruthy()
        expect(newCity.name).toBeInstanceOf(String)
        expect(newCity.cover).toMatch(coverMatch)
        console.log(result)
    })

    it('expected to respond with status code 201 and type of "application/json"', async () => {
        expect(result.status).toEqual(201)
    })

    it("expected to respond with data of type 'application/json'", async () => {
        expect(result.type).toBe('application/json')
    })

    it('expected to respond with "city added"', async () => {
        expect(result._body.data).toEqual('city added')
    })

    it('expected to send the objectId of added city', async () => {
        console.log(result._body) // return all response object
        expect(true).toBe(isValidObjectId(result._body.id))
    })

    afterAll(async () => {
        await City.deleteMany({})
    })
})

describe('DELETE -> /cities', () => {
    let result = ''
    let deleteResult = ''
    const newCity = {
        name: 'Cairo',
        cover: 'https://www.placeholder.com/200x370',
    }

    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
        result = await request.post('/cities').send(newCity)
        // console.log(result._body.id)
    })

    it('expected to send valid object id of city to delete it', async () => {
        // let cityId = result._body.id
        console.log(result)
        deleteResult = await request.delete(`/cities/${result._body.id}`)
        expect(result._body.id).toBeTruthy()
        expect(true).toBe(isValidObjectId(result._body.id))
        console.log(deleteResult)
    })

    it('expected to respond with status code 200 ', async () => {
        expect(deleteResult.status).toEqual(200)
    })

    it("expected to respond with data of type 'application/json'", async () => {
        expect(deleteResult.type).toBe('application/json')
    })

    it('expected to respond with "deleted city"', async () => {
        expect(deleteResult._body.message).toEqual('deleted city')
    })

    it('expected to respond with status code 500', async () => {
        deleteResult = await request.delete(`/cities/${result._body.id}`)
        console.log(deleteResult)
        expect(deleteResult.status).toEqual(500)
    })

    it('expected to respond with "City not found"', async () => {
        expect(deleteResult._body.details).toBe('City not found')
    })

    afterAll(async () => {
        await City.deleteMany({})
    })
})

describe('UPDATE -> /cities', () => {
    let result = ''
    let updateResult = ''
    const newCity = {
        name: 'Cairo',
        cover: 'https://www.placeholder.com/200x370',
    }

    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
        result = await request.post('/cities').send(newCity)
        // console.log(result._body.id)
    })

    it('expected to send valid object id of city to update it', async () => {
        // let cityId = result._body.id
        console.log(result)
        updateResult = await request.put(`/cities/${result._body.id}`)
        expect(result._body.id).toBeTruthy()
        expect(true).toBe(isValidObjectId(result._body.id))
        console.log(updateResult)
    })

    it('expected to respond with status code 422 ', async () => {
        expect(updateResult.status).toEqual(422)
    })

    it('expected to respond with "body must be an array"', async () => {
        expect(updateResult._body.details).toEqual('body must be an array.')
    })

    it('expected to respond with status code 200', async () => {
        updateResult = await request
            .put(`/cities/${result._body.id}`)
            .send([{ prop: 'name', value: 'Faraskour' }])
        console.log(updateResult)
        expect(updateResult.status).toEqual(200)
    })

    it("expected to respond with data of type 'application/json'", async () => {
        expect(updateResult.type).toBe('application/json')
    })

    it('expected to respond with "props are modified name"', async () => {
        expect(updateResult._body.data).toEqual('props are modified name')
    })

    it('expected to respond with status code 500 and city not found', async () => {
        updateResult = await request
            .put(`/cities/c12fc6bdff8cefaa8e5dffec`)
            .send([{ prop: 'name', value: 'Damietta' }])
        console.log(updateResult)
        expect(updateResult.status).toEqual(500)
        expect(updateResult._body.details).toEqual('city not found')
    })

    afterAll(async () => {
        await City.deleteMany({})
    })
})
