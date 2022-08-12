const HelpQuestion = require('../models/helpQuestionModel')
const UserModel = require('../models/userModel')
const AdminModel = require('../models/adminModel')

module.exports.getHelpQuestionsByPage = (request, response, next) => {
    HelpQuestion.paginate(
        {},
        {
            page: request.query.page || 1,
            populate: { path: 'userId' },
        }
    )
        .then((data) => {
            console.log(data)
            if (data == null) throw new Error(' question not found')
            response.status(200).json({
                currentPage: data.page,
                previousPage: data.prevPage,
                nextPage: data.nextPage,
                totalPages: data.totalPages,
                totalHelpQuestions: data.totalDocs,
                helpQuestionsDisplayed: data.docs.length,
                remained: data.totalDocs - data.docs.length,
                results: data.docs,
            })
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.getQuestionById = (request, response, next) => {
    HelpQuestion.findOne({ _id: request.params.id })
        .then((data) => {
            if (data == null) throw new Error(' question not found')
            response.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.createQuestion = (request, response, next) => {
    UserModel.exists({ _id: request.body.userId })
        .then((data) => {
            if (!data)
                throw new Error(`userId isn't available in users collection`)
            const object = new HelpQuestion(request.body)
            return object.save()
        })
        .then((data) => {
            response.status(201).json({ data: 'added', id: data._id })
        })
        .catch((error) => next(error))
}

module.exports.updateHelpQuestion = (request, response, next) => {
    // TODO move validations to the router
    const allowed = ['adminId', 'answer']
    // console.log(allowed)
    const requested = Object.keys(request.body)
    console.log(requested)
    const isValidUpdates = requested.every((i) => allowed.includes(i))
    console.log(isValidUpdates)
    if (!isValidUpdates) {
        throw new Error('Question not allowed')
    } else {
        // if (!Object.keys(request.body).includes('adminId'))
        AdminModel.exists({ _id: request.body.adminId })
            .then((data) => {
                if (!data)
                    throw new Error(
                        `adminId is not available in users collection`
                    )
                const newHelpQuestion = request.body
                console.log(newHelpQuestion)
                return HelpQuestion.findOneAndUpdate(
                    { _id: request.params.id },
                    { $set: newHelpQuestion },
                    { new: false, runValidators: true }
                )
            })
            .then((data) => {
                if (!data) {
                    throw new Error('Question not found')
                } else {
                    response.status(200).json('updated')
                }
            })
            .catch((error) => next(error))
    }
}

module.exports.deleteQuestion = (request, response, next) => {
    HelpQuestion.deleteOne({ _id: request.params.id })
        .then((data) => {
            if (data.deletedCount === 0) {
                throw new Error('QuestionID not found')
            } else {
                response.status(200).json(data)
            }
        })
        .catch((error) => next(error))
}

module.exports.deleteManyQuestion = (request, response, next) => {
    const { ids } = request.body
    HelpQuestion.deleteMany({ _id: { $in: ids } })
        .then((data) => {
            response.status(200).json({ data: 'deleted' })
        })
        .catch((error) => {
            next(error)
        })
}

// module.exports.deleteAllQuestion=(request,response,next)=>{

//   HelpQuestion.deleteMany({})
//   .then(data=>{
//       response.status(200).json({data:"deleted"});

//   })
//   .catch(console.error(error=>{
//       next(error)
//   }))

// }
