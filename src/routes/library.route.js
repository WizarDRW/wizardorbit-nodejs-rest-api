const express = require('express');
const router = express.Router();
const controller = require('../controllers/library.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { validateLibrary } = require('../middleware/validators/libraryValidator.middleware');

/**
 * GET /api/v1/libraries/
 * @tags library
 * @security CookieAuth
 * @summary Brings all library.
 * @return {LibraryDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"Library Name",
 *          "user_data":{},
 *          "description":"",
 *          "image_path":"http://ImagePath",
 *          "private":false,
 *          "contents":[]
 *      }
 * ]
 */
router.get('/', awaitHandlerFactory(controller.getAll));
/**
 * GET /api/v1/libraries/id/{id}
 * @tags library
 * @security CookieAuth
 * @param {string} id.path
 * @summary Returns the first or default.
 * @return {LibraryDto} 200 - Object
 * @example response - 200 - success response example
 * {
 *      "name":"Library Name",
 *      "user_data":{},
 *      "description":"",
 *      "image_path":"http://ImagePath",
 *      "private":false,
 *      "contents":[]
 * }
 */
router.get('/id/:id', awaitHandlerFactory(controller.getById));
/**
 * GET /api/v1/libraries/userid/{user_id}
 * @tags library
 * @security CookieAuth
 * @param {string} user_id.path
 * @summary Brings user's all library.
 * @return {LibraryDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"Library Name",
 *          "user_data":{},
 *          "description":"",
 *          "image_path":"http://ImagePath",
 *          "private":false,
 *          "contents":[]
 *      }
 * ]
 */
router.get('/userid/:user_id', awaitHandlerFactory(controller.getByUserId));
/**
 * POST /api/v1/libraries/
 * @tags library
 * @security CookieAuth
 * @summary Creates new library and returns object.
 * @return {LibraryDto} 200 - Object
 * @example response - 200 - success response example
 * {
 *      "name":"Library Name",
 *      "user_data":{},
 *      "description":"",
 *      "image_path":"http://ImagePath",
 *      "private":false,
 *      "contents":[]
 * }
 */
router.post('/', auth(), validateLibrary, awaitHandlerFactory(controller.create));
router.post('/upload', awaitHandlerFactory(controller.uploadImage));
/**
 * PUT /api/v1/libraries/id/{id}
 * @tags library
 * @security CookieAuth
 * @param {string} id.path
 * @summary Edits library and returns object
 * @return {LibraryDto} 200 - Object
 * @example response - 200 - success response example
 * {
 *      "name":"Library Name",
 *      "user_data":{},
 *      "description":"",
 *      "image_path":"http://ImagePath",
 *      "private":false,
 *      "contents":[]
 * }
 */
router.put('/id/:id', auth(), validateLibrary, awaitHandlerFactory(controller.update));
router.put('/updateImpression/id/:id', awaitHandlerFactory(controller.updateImpression));
/**
 * DELETE /api/v1/libraries/id/{id}
 * @tags library
 * @security CookieAuth
 * @param {string} id.path
 * @summary Deletes library and returns id
 * @return {string} 200 - id
 * @example response - 200 - success response example
 * {
 *      "id":""
 * }
 */
router.delete('/id/:id', auth(Role.Admin, Role.SuperUser), awaitHandlerFactory(controller.delete));

module.exports = router;