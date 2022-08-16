const express = require('express')

const router = express.Router()

const contractController = require('../controllers/contractController')
const validationMW = require('../middlewares/validationMW')
const {
    createContractValidations,
    updateContractValidations,
    deleteUnitContractValidations,
} = require('../middlewares/validations/contractValidations')

const {
    validateId,
    pageValidations,
} = require('../middlewares/validations/generalValidations')

router
    .route('/contracts/unit/:id')
    .get(validateId('unit'), validationMW, contractController.getUnitContracts)
router
    .route('/contracts/:contractId/unit/:id')
    .delete(
        deleteUnitContractValidations,
        validationMW,
        contractController.deleteUnitContract
    )

router.get(
    '/contracts/landlord/:id',
    validateId('Landlord'),
    validationMW,
    contractController.getLandlordContracts
)

router
    .route('/contracts')
    .get(pageValidations, validationMW, contractController.getContractsByPage)
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
    .get(
        validateId('contract'),
        validationMW,
        contractController.getContractById
    )
    .delete(contractController.deleteContractById)

module.exports = router
