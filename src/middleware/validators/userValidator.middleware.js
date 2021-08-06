const { body, check } = require('express-validator');
const Role = require('../../utils/userRoles.utils');
const Status = require('../../utils/userStatuses.utils');

exports.createUserSchema = [
    check('first_name')
        .optional(),
    check('last_name')
        .optional(),
    check('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    check('username')
        .exists()
        .withMessage('Username is required')
        .isLength({ min: 5 })
        .withMessage('Must be at least 5 chars long'),
    check('role')
        .exists()
        .isIn([Role.Admin, Role.SuperUser, Role.Client])
        .withMessage('Invalid Role type'),
    check('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .isLength({ max: 20 })
        .withMessage('Password can contain max 20 characters'),
    check('confirm_password')
        .exists()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('confirm_password field must have the same value as the password field')
];
exports.clientCreateUserSchema = [
    check('first_name')
        .optional(),
    check('last_name')
        .optional(),
    check('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    check('username')
        .exists()
        .withMessage('Username is required')
        .isLength({ min: 5 })
        .withMessage('Must be at least 5 chars long'),
    check('role')
        .not()
        .isEmpty(),
    check('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .isLength({ max: 20 })
        .withMessage('Password can contain max 20 characters'),
    check('confirm_password')
        .exists()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('confirm_password field must have the same value as the password field')
];
exports.updateUserSchema = [
    check('_id')
        .exists()
        .withMessage('_id is required!'),
    check('first_name')
        .optional()
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    check('last_name')
        .optional()
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    check('email')
        .exists()
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    check('username')
        .exists()
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 5 })
        .withMessage('Must be at least 5 chars long'),
    check('role')
        .exists()
        .isIn([Role.Admin, Role.SuperUser, Role.Client])
        .withMessage('Invalid Role type'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['_id', 'username', 'email', 'role', 'first_name', 'last_name', 'image_path', 'create_date', 'update_date', '__v'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];
exports.clientUpdateUserSchema = [
    check('_id')
        .exists()
        .withMessage('_id is required!'),
    check('first_name')
        .optional()
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    check('last_name')
        .optional()
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    check('email')
        .exists()
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    check('username')
        .exists()
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 5 })
        .withMessage('Must be at least 5 chars long'),
    check('role')
        .not()
        .isEmpty(),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['_id', 'username', 'email', 'first_name', 'last_name', 'image_path', 'create_date', 'update_date', '__v'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];
exports.validateResetPassword = [
    check('_id')
        .exists()
        .withMessage('_id is required!'),
    check('password')
        .optional()
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .isLength({ max: 20 })
        .withMessage('Password can contain max 20 characters')
        .custom((value, { req }) => !!req.body.confirm_password)
        .withMessage('Please confirm your password'),
    check('confirm_password')
        .optional()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('confirm_password field must have the same value as the password field'),
];
exports.validateLogin = [
    check('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    check('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .withMessage('Password must be filled')
];
exports.validateStatus = [
    check('_id')
        .exists(),
    check('status')
        .exists()
        .withMessage("Status is required!")
        .isIn([Status.Online, Status.Offline, Status.Block])
        .withMessage('Invalid Status type')
]