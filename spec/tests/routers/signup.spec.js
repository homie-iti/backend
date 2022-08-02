/* eslint-disable no-undef */
// process.env.NODE_ENV = 'test'
const mongoose = require('mongoose')

const supertest = require('supertest')
const app = require('../../../src/app')
const User = require('../../../src/models/userModel')

const request = supertest(app) // initiated new app connection and ran it

const endpoint = '/signup'

describe(`GET -> ${endpoint}`, () => {
    const user = {
        nationalId: 2222,
        phone: 10101010101,
        password: '1234@abcd',
        confirmPassword: '1234@abcd',
        age: 28,
        gender: 'male',
        firstName: 'Mahmoud',
        lastName: 'Nader',
        middleName: 'Yasser',
        email: 'hambozo@sdsdsd.scc',
    }

    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
    })

    it('expected to respond with status code 200', async () => {
        const result = await request
            .post(`${endpoint}/check-availability`)
            .send({ nationalId: user.nationalId })
        // console.log(result.body) // return all response object
        expect(result.status).toEqual(200)
    })
    it('expected to respond with data = true', async () => {
        const result = await request
            .post(`${endpoint}/check-availability`)
            .send({ nationalId: user.nationalId })
        // console.log(result) // return all response object
        expect(result.body.isAvailable).toBe(true)
    })

    it('expected to send the data of a user used in signup', async () => {
        const result = await request.post(`${endpoint}`).send(user)
        console.log(result)
        // expect(result.status).toEqual(201)
        expect(result.body.userInfo).toBeTruthy()
        expect(result.body.userInfo).toBeInstanceOf(Object)
    })

    it('expected to respond with data = false', async () => {
        const result = await request
            .post(`${endpoint}/check-availability`)
            .send({ nationalId: user.nationalId })
        // console.log(result.body) // return all response object
        expect(result.body.isAvailable).toBe(false)
    })

    afterAll(async () => {
        await User.deleteMany({})
    })
})
