const { check } = require('express-validator');
exports.validate = [
    check('email')
    .exists()
    .withMessage("Comment email is required")
]