const express = require('express')
const { query, param, body } = require('express-validator')

const router = express.Router()
const validationMW = require('../middlewares/validationMW')
const {
    helpQuestionPostValidation,
    helpQuestionUpdateValidation,
    helpQuestionDeleteValidation,
} = require('../middlewares/validations/helpQuestionsValidations')
const helpController = require('../controllers/helpQuestionController')

router
    .route('/help-questions')

    .get(
        [
            query('page')
                .optional()
                .isNumeric()
                .withMessage('Page number should number'),
        ],
        validationMW,
        helpController.getHelpQuestionsByPage
    )

    .post(
        helpQuestionPostValidation,
        validationMW,
        helpController.createQuestion
    )

// .put(
//     helpQuestionUpdateValidation,
//     validationMW,
//     helpController.updateHelpQuestion
// )

// router.route("/helpQuestion/all")
//     .delete(helpController.deleteAllQuestion)

router.route('/helpQuestion/many').delete(helpController.deleteManyQuestion)

router
    .route('/helpQuestion/:id')
    .get(
        validateId('HelpQuestion', param),
        validationMW,
        helpController.getQuestionById
    )
    .put(
        helpQuestionUpdateValidation,
        validationMW,
        helpController.updateHelpQuestion
    )

    .delete(
        validateId('HelpQuestion', param),
        validationMW,
        helpController.deleteQuestion
    )

module.exports = router
