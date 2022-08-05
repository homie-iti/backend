/* eslint-disable no-undef */
// process.env.NODE_ENV = 'test'

const supertest = require('supertest')
const app = require('../../../src/app')
const helpQuestionModel = require('../../../src/models/helpQuestionModel')
const UserModel = require('../../../src/models/userModel')
const AdminModel = require('../../../src/models/adminModel')

const request = supertest(app) // initiated a new app connection and ran it

const newUser = {
    fullName: 'Nooor Ali',
    age: 20,
    email: 'noorali01@gmail.com',
    gender: 'female',
    password: 'noor@123',
    phone: '01001512136447',
    national_id: 142515657844154,
    address: {
        city: 'Cairo',
    },
    balance: 2000,
}
const newAdmin = {
    fullName: 'Ali Adel Amir',
    age: 30,
    email: 'aliadel@yahoo.com',
    gender: 'male',
    password: 'Aliiii@1425',
    phone: '01040074837',
    national_id: 55122884145310920,
}
let userId
let adminId

let userData
let adminData

beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
    userData = await request.post('/users').send(newUser)
    console.log(userData)
    userId = userData._body.id
    console.log(userId)
    adminData = await request.post('/admins').send(newAdmin)
    // console.log(adminData)
    adminId = adminData._body.id
    console.log(adminId)
})

afterAll(async () => {
    await helpQuestionModel.deleteMany({})
    await UserModel.deleteMany({})
    await AdminModel.deleteMany({})
})

describe('GET -> /help-questions', () => {
    let result = ''
    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
        result = await request.get('/help-questions')
    })

    it('expected to respond with status code 200', () => {
        expect(result.status).toEqual(200)
    })
    it("expected to respond with data of type 'application/json'", () => {
        expect(result.type).toBe('application/json')
    })
    it('expected to return an object containing help. Questions on the selected page or on page one if not and information like next,previous,total page', () => {
        expect(result._body).toBeInstanceOf(Object)
    })
})

describe('POST -> /help-questions', () => {
    let result
    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
    })

    it('expected to respond with status code 422 with message"Question should be characters. ', async () => {
        // console.log(userId)
        result = await request
            .post('/help-questions')
            .send({ userId, adminId, question: 123, answer: 'ok' })
        // console.log(result)
        expect(result.status).toEqual(422)
        expect(result._body.details).toBe('Question should be characters.')
    })

    it('expected to respond with status code 500 with message"Cast to ObjectId failed for value "dc7daf3e33"" ', async () => {
        // console.log(userId)
        result = await request
            .post('/help-questions')
            .send({ userId: 'dc7daf3e33', question: 'hello', answer: 'ok' })
        // console.log(result)
        expect(result.status).toEqual(500)
        expect(result._body.details).toBe(
            'Cast to ObjectId failed for value "dc7daf3e33" (type string) at path "_id" for model "users"'
        )
    })

    it('expected to respond with status code 500 with message"userId not available in users collection" ', async () => {
        // console.log(userId)
        result = await request.post('/help-questions').send({
            userId: 'dc7daf3e33aec47b4ceed945',
            question: 'hello',
            answer: 'ok',
        })
        // console.log(result)
        expect(result.status).toEqual(500)
        expect(result._body.details).toBe(
            "userId isn't available in users collection"
        )
    })

    it('expected to respond with status code 500 with message"adminId not available in users collection" ', async () => {
        // console.log(userId)
        result = await request.post('/help-questions').send({
            userId,
            adminId: 'dc7daf3e33aec47b4ceed988',
            question: 'what why?',
            answer: 'Yes No',
        })
        // console.log(result)
        expect(result.status).toEqual(500)
        expect(result._body.details).toBe(
            "adminId isn't available in users collection"
        )
    })

    it('expected to respond with status code 201 and type of "application/json"', async () => {
        result = await request
            .post('/help-questions')
            .send({ userId, adminId, question: 'why?', answer: 'ok' })
        console.log(result)
        expect(result.status).toEqual(201)
        expect(result.type).toBe('application/json')
    })

    // afterAll(async () => {
    //     await helpQuestionModel.deleteMany({})
    // })
})

describe('UPDATE -> /helpQuestion', () => {
    let updateResult
    let questionId
    let questionData
    console.log(userId)
    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
        questionData = await request
            .post('/help-questions')
            .send({ userId, adminId, question: 'finally?', answer: 'aywaa' })
        // console.log(questionData)
        questionId = questionData._body.id
        console.log(questionId)
    })

    it('expected to respond with status code 422 with message "Question name should be characters." ', async () => {
        updateResult = await request.put(`/helpQuestion/${questionId}`).send({})
        expect(updateResult.status).toEqual(422)
        expect(updateResult._body.details).toEqual(
            'Question name should be characters.'
        )
    })

    it('expected to respond with status code 500 with message "userId is not available in users collection" ', async () => {
        updateResult = await request
            .put(`/helpQuestion/${questionId}`)
            .send({ adminId, question: 'what' })
        expect(updateResult.status).toEqual(500)
        expect(updateResult._body.details).toEqual(
            'userId is not available in users collection'
        )
    })

    it('expected to respond with status code 200 with data of type "application/json" ', async () => {
        updateResult = await request
            .put(`/helpQuestion/${questionId}`)
            .send({ adminId, userId, question: 'what' })
        expect(updateResult.status).toEqual(200)
        expect(updateResult.type).toBe('application/json')
    })

    it('expected to respond with status code 500 with message "Question not found" ', async () => {
        updateResult = await request
            .put(`/helpQuestion/d7e3d89a23f9b5b1ecf56a4e`)
            .send({ adminId, userId, question: 'what' })
        // console.log(updateResult)
        expect(updateResult.status).toEqual(500)
        expect(updateResult._body.details).toBe('Question not found')
    })

    afterAll(async () => {
        await helpQuestionModel.deleteMany({})
    })
})

describe('DELETE -> /helpQuestion', () => {
    let deleteResult
    let questionId
    let questionData
    console.log(userId)
    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
        questionData = await request
            .post('/help-questions')
            .send({ userId, adminId, question: 'finally?', answer: 'aywaa' })
        // console.log(questionData)
        questionId = questionData._body.id
        console.log(questionId)
    })

    it('expected to respond with deletedCount =1', async () => {
        deleteResult = await request.delete(`/helpQuestion/${questionId}`)
        console.log(questionId)
        // console.log(deleteResult)
        expect(deleteResult._body.deletedCount).toBe(1)
    })

    it('expected to respond with status code 200 ', () => {
        expect(deleteResult.status).toEqual(200)
    })

    it("expected to respond with data of type 'application/json'", () => {
        expect(deleteResult.type).toBe('application/json')
    })

    it('expected to respond with status code 500 with message QuestionID not found.', async () => {
        deleteResult = await request.delete(`/helpQuestion/${questionId}`)
        // console.log(deleteResult)
        expect(deleteResult.status).toEqual(500)
        expect(deleteResult._body.details).toEqual('QuestionID not found')
    })

    it('expected to respond with status code 422 with message helpQuestion id is not valid.', async () => {
        deleteResult = await request.delete(`/helpQuestion/12598`)
        // console.log(deleteResult)
        expect(deleteResult.status).toEqual(422)
        expect(deleteResult._body.details).toEqual(
            'helpQuestion id is not valid.'
        )
    })

    // afterAll(async () => {
    //     await helpQuestionModel.deleteMany({})
    // })
})
