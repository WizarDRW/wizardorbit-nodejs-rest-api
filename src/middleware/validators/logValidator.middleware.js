const { check } = require('express-validator');
exports.validateLog = [
    check('title')
        .exists()
        .withMessage("Title is required")
        .isLength({ min: 4 })
        .withMessage('Must be at least 4 chars long')
        .isLength({ max: 20 })
        .withMessage('Title can contain max 20 characters'),
    check('datas')
        .exists()
        .withMessage('Datas is required')
        .isLength({ min: 1 })
        .withMessage('Must be at least 1 array long')
]