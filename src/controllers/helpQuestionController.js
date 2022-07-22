let HelpQuestion = require('./../models/helpQuestionModel')

module.exports.getAllQuestion = (request, response, next) => {
    HelpQuestion.find({})
        .then((data) => {
            if (data == null) next(new Error(' question not found'))
            response.status(200).json(data)
        })
        .catch(
            console.error((error) => {
                next(error)
            })
        )
}

module.exports.getQuestionById = (request, response, next) => {
    HelpQuestion.findOne({ _id: request.params.id })
        .then((data) => {
            if (data == null) next(new Error(' question not found'))
            response.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.createQuestion = (request, response, next) => {
    let object = new HelpQuestion(request.body)
    object
        .save()
        .then((data) => {
            response.status(201).json({ data: 'added' })
        })
        .catch((error) => next(error))
}

module.exports.updateHelpQuestion = (request, response, next) => {
    let allowed = ['_id', 'userId', 'adminId', 'question', 'answer']
    console.log(allowed)
    let requested = Object.keys(request.body)
    console.log(requested)
    const isValidUpdates = requested.every((i) => allowed.includes(i))
    console.log(isValidUpdates)
    if (!isValidUpdates) {
        next(new Error('Question not allowed'))
    } else {
        let newHelpQuestion = request.body
        HelpQuestion.findOneAndUpdate(
            { _id: request.body._id },
            { $set: newHelpQuestion },
            { new: false, runValidators: true }
        )
            .then((data) => {
                if (!data) {
                    next(new Error('Question not found'))
                } else {
                    response.status(200).json('updated')
                }
            })
            .catch((error) => next(error))
    }
}

module.exports.deleteQuestion = (request, response, next) => {
    HelpQuestion.deleteOne({ _id: request.body._id })
        .then((data) => {
            if (data.deletedCount == 0) {
                next(new Error('QuestionID not found'))
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
        .catch(
            console.error((error) => {
                next(error)
            })
        )
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
