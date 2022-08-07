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
        validateId('Unit', param),
        validationMW,
        contractController.getUnitContracts
    )
router
    .route('/contracts/:contractId/unit/:id')
    .delete(
        validateId('Unit', param),
        validationMW,
        contractController.deleteUnitContract
    )

router.get(
    '/contracts/landlord/:id',
    validateId('Landlord', param),
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

router
    .route('/contracts/:id')
    .get(contractController.getContractById)
    // .delete(contractController.deleteContractById)

module.exports = router
