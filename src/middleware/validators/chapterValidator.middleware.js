const { check } = require('express-validator');
exports.createValidateChapter = [
    check('name')
        .exists()
        .withMessage("Name is required")
        .notEmpty()
        .isLength({ min: 10 })
        .withMessage('Must be at least 10 chars long')
        .isLength({ max: 60 })
        .withMessage('Name can contain max 60 characters'),
    check('short_description')
        .exists()
        .withMessage("Short description is required")
        .notEmpty()
        .isLength({ min: 20 })
        .withMessage('Must be at least 20 chars long')
        .isLength({ max: 150 })
        .withMessage('Short description can contain max 150 characters'),
    check('image_path')
        .exists()
        .withMessage('Image path is required'),
    check('categories')
        .exists()
        .withMessage('Categories is required')
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage('Must be at least 1 arrays long'),
    check('tags')
        .exists()
        .withMessage('Tags is required')
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage('Must be at least 1 arrays long'),
    check('descriptions')
        .exists()
        .withMessage('Descriptions is required')
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 arrays long')
]

exports.updateValidateChapter = [
    check('name')
        .exists()
        .withMessage("Name is required")
        .notEmpty()
        .isLength({ min: 15 })
        .withMessage('Must be at least 15 chars long')
        .isLength({ max: 60 })
        .withMessage('Name can contain max 60 characters'),
    check('short_description')
        .exists()
        .withMessage("Short description is required")
        .notEmpty()
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
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage('Must be at least 1 arrays long'),
    check('tags')
        .exists()
        .withMessage('Tags is required')
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage('Must be at least 1 arrays long'),
    check('descriptions')
        .exists()
        .withMessage('Descriptions is required')
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 arrays long')
]