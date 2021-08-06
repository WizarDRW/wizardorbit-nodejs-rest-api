const { check } = require('express-validator');
exports.validateLibrary = [
    check('mode')
        .exists()
        .withMessage('Mode is required')
        .isIn(['dark', 'light'])
        .withMessage('Invalid mode type'),
    check('name')
        .exists()
        .withMessage("name is required")
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .isLength({ max: 30 })
        .withMessage('Name can contain max 30 characters'),
    check('base_colors')
        .exists()
        .withMessage('Base colors is required')
        .isLength({min: 4})
        .withMessage('Must be at least 4 arrays long'),
    check('color_scss')
        .exists()
        .withMessage('Color scss is required')
]
