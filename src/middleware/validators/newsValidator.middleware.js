const { check } = require('express-validator');
exports.createValidateNews = [
    check('name')
        .exists()
        .withMessage("Name is required")
        .isLength({ min: 15 })
        .withMessage('Must be at least 15 chars long')
        .isLength({ max: 60 })
        .withMessage('Name can contain max 60 characters'),
    check('short_description')
        .exists()
        .withMessage("Short description is required")
        .isLength({ min: 30 })
        .withMessage('Must be at least 30 chars long')
        .isLength({ max: 150 })
        .withMessage('Short description can contain max 150 characters'),
    check('image_path')
        .exists()
        .withMessage('Image path is required'),
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
    check('descriptions')
        .exists()
        .withMessage('Descriptions is required')
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 arrays long')
]