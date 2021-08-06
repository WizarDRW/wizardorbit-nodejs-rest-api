const { check } = require('express-validator');
exports.validateLibrary = [
    check('type')
        .exists()
        .withMessage('Type is required')
        .isIn(['chapter', 'news', 'forum'])
        .withMessage('Invalid type'),
    check('data')
        .exists()
        .withMessage("Data is required")
]
