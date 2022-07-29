const express = require('express')
const { query } = require('express-validator')

const router = express.Router()
const validationMW = require('../middlewares/validationMW')
const {
    helpQuestionPostValidation,
    helpQuestionUpdateValidation,
    helpQuestionDeleteValidation,
} = require('../middlewares/validtion')
const helpController = require('../controllers/helpQuestionController')

router
    .route('/help-questions')

    .get(
        [query('page').isNumeric().withMessage('Page number should number')],
        validationMW,
        helpController.getHelpQuestionsByPage
    )

    .post(
        helpQuestionPostValidation,
        validationMW,
        helpController.createQuestion
    )

    .put(
        helpQuestionUpdateValidation,
        validationMW,
        helpController.updateHelpQuestion
    )

// router.route("/helpQuestion/all")
//     .delete(helpController.deleteAllQuestion)

router.route('/helpQuestion/many').delete(helpController.deleteManyQuestion)

router
    .route('/helpQuestion/:id')
    .get(helpController.getQuestionById)

    .delete(
        helpQuestionDeleteValidation,
        validationMW,
        helpController.deleteQuestion
    )

module.exports = router
