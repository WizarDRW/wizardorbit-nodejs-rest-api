const express = require('express');
const router = express.Router();
const controller = require('../controllers/category.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');


/**
 * GET /api/v1/categories/
 * @tags category
 * @security CookieAuth
 * @summary Brings all categories. Only Super User can summon.
 * @return {CategoryDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "type":"",
 *          "categories":[]
 *      }
 * ]
 */
router.get('/', auth(Role.SuperUser), awaitHandlerFactory(controller.getAll));
/**
 * GET /api/v1/categories/id/{id}
 * @tags category
 * @security CookieAuth
 * @param {string} id.path
 * @summary Returns the first or default.
 * @return {CategoryDto} 200 - Object
 * @example response - 200 - success response example
 * {
 *      "type":"",
 *      "categories":[]
 * }
 */
router.get('/id/:id', awaitHandlerFactory(controller.getById));
/**
 * GET /api/v1/categories/type/{type}
 * @tags category
 * @security CookieAuth
 * @param {string} type.path
 * @summary Returns the first or default for type.
 * @return {CategoryDto} 200 - Object
 * @example response - 200 - success response example
 * {
 *      "type":"",
 *      "categories":[]
 * }
 */
router.get('/type/:type', awaitHandlerFactory(controller.getByType));
/**
 * POST /api/v1/categories/
 * @tags category
 * @security CookieAuth
 * @summary Creates new category and returns object.
 * @return {CategoryDto} 200 - Object
 * @example response - 200 - success response example
 * {
 *      "type":"",
 *      "categories":[]
 * }
 */
router.post('/', auth(Role.SuperUser), awaitHandlerFactory(controller.create));
/**
 * PUT /api/v1/categories/id/{id}
 * @tags category
 * @security CookieAuth
 * @summary Edits category and returns object.
 * @return {CategoryDto} 200 - Object
 * @example response - 200 - success response example
 * {
 *      "type":"",
 *      "categories":[]
 * }
 */
router.put('/id/:id', auth(Role.SuperUser), awaitHandlerFactory(controller.update));
/**
 * DELETE /api/v1/categories/id/{id}
 * @tags category
 * @security CookieAuth
 * @summary Delete category and returns object.
 * @return {string} 200 - id
 * @example response - 200 - success response example
 * {
 *      "id":""
 * }
 */
router.delete('/id/:id', auth(Role.SuperUser), awaitHandlerFactory(controller.delete));

module.exports = router;