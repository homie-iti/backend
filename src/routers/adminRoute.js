const express = require('express')
const { body, param, query } = require('express-validator')
const validationMW = require('../middlewares/validationMW')
const adminController = require('../controllers/adminController')
const { authMW, adminOnly } = require('../middlewares/authMW')

const router = express.Router()

router
    .route('/admins')
    // .get( adminController.getAllAdmins )
    .get(
        [
            query('page')
                .optional()
                .isNumeric()
                .withMessage('Page number should number'),
        ],
        validationMW,
        adminController.getAdminsByPage
    )
    .post(
        authMW,
        adminOnly,
        [
            body('id').isMongoId().withMessage('id should be isMongoId '),
            body('fullName')
                .isAlpha('en-US', { ignore: ' ' })
                .withMessage('user name should be characters'),
            body('age').isNumeric().withMessage('age should be number'),
            body('email')
                .isString()
                .withMessage('admin email should be string'),
            body('password')
                .isString()
                .withMessage('admin password should be string'),
            body('phone')
                .isNumeric()
                .withMessage('admin phone should be number'),
            body('national_id')
                .isNumeric()
                .withMessage('admin national ID should be number'),
        ],
        validationMW,
        adminController.createAdmin
    )
    .put(
        authMW,
        adminOnly,
        [
            body('id').isMongoId().withMessage('id should be isMongoId '),
            body('fullName')
                .isAlpha('en-US', { ignore: ' ' })
                .withMessage('user name should be characters'),
            body('age').isNumeric().withMessage('age should be number'),
            body('email')
                .isString()
                .withMessage('admin email should be string'),
            body('password')
                .isString()
                .withMessage('admin password should be string'),
            body('phone')
                .isNumeric()
                .withMessage('admin phone should be number'),
            body('national_id')
                .isNumeric()
                .withMessage('admin national ID should be number'),
        ],
        validationMW,
        adminController.updateAdmin
    )

router
    .route('/admins/:id')
    .get(
        authMW,
        adminOnly,
        [param('id').isMongoId().withMessage('admin id should be objectID')],
        validationMW,
        adminController.getAdminByID
    )
    .delete(
        authMW,
        adminOnly,
        [param('id').isMongoId().withMessage('admin id should be objectID')],
        validationMW,
        adminController.deleteAdmin
    )

module.exports = router
