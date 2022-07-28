/* eslint-disable no-undef */
// process.env.NODE_ENV = 'test'

const supertest = require('supertest')
const app = require('../../../src/app')

const request = supertest(app) // initiated new app connection and ran it

describe('GET -> /units', () => {
    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
    })

    it('expected to respond with status code 200', async () => {
        const result = await request.get('/units')
        // console.log(result) // return all response object
        expect(result.status).toEqual(200)
    })
    it("expected to respond with data of type 'application/json'", async () => {
        const result = await request.get('/units')
        // console.log(result) // return all response object
        expect(result.type).toBe('application/json')
    })
    it('expected to get all units', async () => {
        const result = await request.get('/units')
        // console.log(result._body)
        // expect(result.status).toEqual(200)
    })
})
