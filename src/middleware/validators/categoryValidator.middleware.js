const { check } = require('express-validator');
exports.validateCategory = [
    check('type')
        .exists()
        .withMessage("Category type is required"),
    check('categories')
        .exists()
        .withMessage('Categories is required')
]