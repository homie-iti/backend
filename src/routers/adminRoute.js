const express = require('express')
const { body, param } = require('express-validator')
const validationMW = require('../middlewares/validationMW')
const {
    validateId,
    pageValidations,
} = require('../middlewares/validations/generalValidations')
const {
    addAdminValidations,
    updateAdminValidations,
} = require('../middlewares/validations/adminValidations')
const adminController = require('../controllers/adminController')
const { authMW, adminOnly } = require('../middlewares/authMW')

const router = express.Router()

router
    .route('/admins')
    // .get( adminController.getAllAdmins )
    .get(pageValidations, validationMW, adminController.getAdminsByPage)
    .post(
        // authMW,
        // adminOnly,
        addAdminValidations,
        validationMW,
        adminController.createAdmin
    )
    .put(
        // authMW,
        // adminOnly,
        updateAdminValidations,
        validationMW,
        adminController.updateAdmin
    )

router
    .route('/admins/:id')
    .get(
        // authMW,
        // adminOnly,
        validateId('admin'),
        validationMW,
        adminController.getAdminByID
    )
    .delete(
        // authMW,
        // adminOnly,
        validateId('admin'),
        validationMW,
        adminController.deleteAdmin
    )

module.exports = router
