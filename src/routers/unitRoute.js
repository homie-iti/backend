const express = require('express')

const router = express.Router()
const { param } = require('express-validator')

const unitController = require('../controllers/unitController')

const validationMW = require('../middlewares/validationMW')
const {
    addUnitValidations,
    updateUnitValidations,
} = require('../middlewares/validations/unitValidations')

const {
    validateId,
    pageValidations,
} = require('../middlewares/validations/generalValidations')
const uploadImage = require('../middlewares/uploadImagesMW')

router
    .route('/units')
    .get(pageValidations, validationMW, unitController.getUnitsByPage)

    .post(
        uploadImage('units/unitsImages').fields([
            { name: 'unitCover', maxCount: 1 },
            { name: 'unitImages', maxCount: 4 },
        ]),
        addUnitValidations,
        validationMW,
        unitController.createUnit
    )
    .put(updateUnitValidations, validationMW, unitController.updateUnitData)

router
    .route('/units/:id')
    .get(validateId('unit', param), validationMW, unitController.getUnitById)
    .delete(validateId('unit', param), validationMW, unitController.deleteUnit)

router
    .route('/units/cover/:id')
    .post(
        validateId('unit', param),
        validationMW,
        uploadImage('units/cover').single('cover'),
        unitController.uploadUnitCover
    )
    .put(
        validateId('unit', param),
        validationMW,
        uploadImage('units/cover').single('cover'),
        unitController.updateUnitCover
    )

router
    .route('/units/images/:id')
    .post(
        validateId('unit', param),
        validationMW,
        uploadImage('units/unitsImages').array('unitImages', 4),
        unitController.uploadUnitImages
    )
    .delete(
        validateId('unit', param),
        validationMW,
        unitController.deleteUnitImages
    )

// router.get(
//     '/units/reviews/:id',

//     [
//         query('page')
//             .optional()
//             .isNumeric()
//             .withMessage('Page number should number'),
//         param('id').isMongoId().withMessage('Unit Id Must Be ObjectId'),
//     ],
//     validationMW,
//     unitController.getUnitReviewsByPage
// )

router
    .route('/reviews')
    .get(unitController.getAllReviews)
    .post(unitController.addReview)

router
    .route('/units/reviews/:id')
    .get(validateId('unit', param), validationMW, unitController.getUnitReviews)
    .delete(
        validateId('unit', param),
        validationMW,
        unitController.deleteUnitReviews
    )

router.get(
    '/reviews/:id',
    validateId('review', param),
    validationMW,
    unitController.getReviewById
)

module.exports = router
