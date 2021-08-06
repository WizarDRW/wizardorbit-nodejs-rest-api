const { check } = require('express-validator');
exports.validateLibrary = [
    check('name')
    .exists()
    .withMessage("Library name is required"),
    check('description')
    .optional(),
    check('image_path')
    .optional(),
    check('private')
    .exists()
    .withMessage("Library status is required"),
    check('contents')
    .exists()
    .withMessage("Library contents is required")
    .isLength({min: 1})
]