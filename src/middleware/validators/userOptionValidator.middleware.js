const { check } = require('express-validator');
exports.updateValidateUserOption = [
    check('password')
    .exists()
    .withMessage("Password is required")
]