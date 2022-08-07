const express = require('express')

const router = express.Router()
const { body, param, query } = require('express-validator')

const contractController = require('../controllers/contractController')
const validationMW = require('../middlewares/validationMW')
const {
    createContractValidations,
    updateContractValidations,
} = require('../middlewares/validations/contractValidations')

router
    .route('/contracts/unit/:id')
    .get(
        [param('id').isMongoId().withMessage('Unit Id Must Be ObjectId')],
        validationMW,
        contractController.getUnitContracts
    )
    .delete(
        [param('id').isMongoId().withMessage('Unit Id Must Be ObjectId')],
        validationMW,
        contractController.deleteUnitContract
    )

router.get(
    '/contracts/landlord/:id',
    [param('id').isMongoId().withMessage('Unit Id Must Be ObjectId')],
    validationMW,
    contractController.getLandlordContracts
)

router
    .route('/contracts')
    //  .get(contractController.getAllContracts)
    .get(
        [
            query('page')
                .optional()
                .isNumeric()
                .withMessage('Page number should number'),
        ],
        validationMW,
        contractController.getContractsByPage
    )
    .post(
        createContractValidations,
        validationMW,
        contractController.addContract
    )
    .put(
        updateContractValidations,
        validationMW,
        contractController.updateContractData
    )

router.get('/contracts/:id', contractController.getContract)
module.exports = router
