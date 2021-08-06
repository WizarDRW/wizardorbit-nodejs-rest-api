const { check } = require('express-validator');
exports.validateMenu = [
    check('name')
    .exists()
    .withMessage("Blog name is required")
]