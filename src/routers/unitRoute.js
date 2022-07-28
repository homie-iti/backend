const express = require('express')

const router = express.Router()
const { body, param, query } = require('express-validator')

const unitController = require('../controllers/unitController')

const validationMW = require('../middlewares/validationMW')
const {
    addUnitValidations,
    updateUnitValidations,
} = require('../middlewares/unitValidations')

const uploadImage = require('../middlewares/uploadImagesMW')

router
    .route('/units')
    .get(unitController.getAllUnits)
    .post(
        uploadImage('units/unitsImages').fields([
            { name: 'unitCover', maxCount: 1 },
            { name: 'unitImages', maxCount: 8 },
        ]),
        addUnitValidations,
        validationMW,
        unitController.createUnit
    )
    .put(updateUnitValidations, validationMW, unitController.updateUnitData)

router
    .route('/units/:id')
    .get(
        [param('id').isMongoId().withMessage('Unit Id Must Be ObjectId')],
        validationMW,
        unitController.getUnitById
    )
    .delete(
        [param('id').isMongoId().withMessage('Unit Id Must Be ObjectId')],
        validationMW,
        unitController.deleteUnit
    )

router
    .route('/units/cover/:id')
    .post(
        [param('id').isMongoId().withMessage('Unit Id Must Be ObjectId')],
        validationMW,
        uploadImage('units/cover').single('cover'),
        unitController.uploadUnitCover
    )
    .put(
        [param('id').isMongoId().withMessage('Unit Id Must Be ObjectId')],
        validationMW,
        uploadImage('units/cover').single('cover'),
        unitController.updateUnitCover
    )

router
    .route('/units/images/:id')
    .post(
        [param('id').isMongoId().withMessage('Unit Id Must Be ObjectId')],
        validationMW,
        uploadImage('units/unitsImages').array('unitImages', 5),
        unitController.uploadUnitImages
    )
    .delete(
        [param('id').isMongoId().withMessage('Unit Id Must Be ObjectId')],
        validationMW,
        unitController.deleteUnitImages
    )

router.get(
    '/units/reviews/:id',
    [param('id').isMongoId().withMessage('Unit Id Must Be ObjectId')],
    validationMW,
    unitController.getUnitReviews
)

router
    .route('/reviews')
    .get(unitController.getAllReviews)
    .post(unitController.addReview)

router.get('/units/ratings/:id', unitController.getUnitAverageRatings)

router.get('/agents', unitController.getAllAgents)
router.get('/agents/:id', unitController.getAgentById)

module.exports = router
