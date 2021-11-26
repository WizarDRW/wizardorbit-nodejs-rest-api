const { check } = require('express-validator');
exports.createValidateForum = [
    check('name')
        .exists()
        .withMessage("Name is required")
        .isLength({ min: 15 })
        .withMessage('Must be at least 15 chars long')
        .isLength({ max: 60 })
        .withMessage('Name can contain max 60 characters'),
    check('description')
        .exists()
        .withMessage("Short description is required")
        .isLength({ min: 30 })
        .withMessage('Must be at least 30 chars long')
        .isLength({ max: 550 })
        .withMessage('Short description can contain max 150 characters'),
    check('categories')
        .exists()
        .withMessage('Categories is required')
        .isLength({ min: 1 })
        .withMessage('Must be at least 1 arrays long'),
    // check('tags')
    //     .exists()
    //     .withMessage('Tags is required')
    //     .isLength({ min: 1 })
    //     .withMessage('Must be at least 1 arrays long'),
]

exports.updateValidateForum = [
    check('name')
        .exists()
        .withMessage("Name is required")
        .isLength({ min: 15 })
        .withMessage('Must be at least 15 chars long')
        .isLength({ max: 60 })
        .withMessage('Name can contain max 60 characters'),
    check('description')
        .exists()
        .withMessage("Short description is required")
        .isLength({ min: 30 })
        .withMessage('Must be at least 30 chars long')
        .isLength({ max: 150 })
        .withMessage('Short description can contain max 150 characters'),
    check('categories')
        .exists()
        .withMessage('Categories is required')
        .isLength({ min: 1 })
        .withMessage('Must be at least 1 arrays long'),
    check('tags')
        .exists()
        .withMessage('Tags is required')
        .isLength({ min: 1 })
        .withMessage('Must be at least 1 arrays long'),
]