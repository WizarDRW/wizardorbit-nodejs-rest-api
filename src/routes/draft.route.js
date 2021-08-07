const express = require('express');
const router = express.Router();
const controller = require('../controllers/draft.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');


/**
 * GET /api/v1/drafts/
 * @tags draft
 * @security CookieAuth
 * @summary Brings all drafts. Only Super User can summon.
 * @return {DraftDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "user_id":"",
 *          "create_date":"2100-00-00T00:00:00.000Z",
 *          "update_date":"2100-00-00T00:00:00.000Z",
 *          "type":"",
 *          "data":""
 *      }
 * ]
 */
router.get('/', auth(Role.SuperUser), awaitHandlerFactory(controller.getAll));
/**
 * GET /api/v1/drafts/id/{id}
 * @tags draft
 * @security CookieAuth
 * @param {string} id.path
 * @summary Returns the first or default.
 * @return {DraftDto} 200 - Object
 * @example response - 200 - success response example
 * {
 *      "user_id":"",
 *      "create_date":"2100-00-00T00:00:00.000Z",
 *      "update_date":"2100-00-00T00:00:00.000Z",
 *      "type":"",
 *      "data":""
 * }
 */
router.get('/id/:id', auth(), awaitHandlerFactory(controller.getById));
/**
 * GET /api/v1/drafts/userid/{user_id}
 * @tags draft
 * @security CookieAuth
 * @param {string} user_id.path
 * @summary Returns the user's drafts.
 * @return {DraftDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "user_id":"",
 *          "create_date":"2100-00-00T00:00:00.000Z",
 *          "update_date":"2100-00-00T00:00:00.000Z",
 *          "type":"",
 *          "data":""
 *      }
 * ]
 */
router.get('/userid/:user_id', auth(), awaitHandlerFactory(controller.getByUserId));
/**
 * POST /api/v1/drafts/
 * @tags draft
 * @security CookieAuth
 * @summary Creates new draft and returns object.
 * @return {DraftDto} 200 - Object
 * @example response - 200 - success response example
 * {
 *      "user_id":"",
 *      "create_date":"2100-00-00T00:00:00.000Z",
 *      "update_date":"2100-00-00T00:00:00.000Z",
 *      "type":"",
 *      "data":""
 * }
 */
router.post('/', auth(), awaitHandlerFactory(controller.create));
/**
 * PUT /api/v1/drafts/id/{id}
 * @tags draft
 * @security CookieAuth
 * @param {string} id.path
 * @summary Edits draft and returns object
 * @return {DraftDto} 200 - Object
 * @example response - 200 - success response example
 * {
 *      "user_id":"",
 *      "create_date":"2100-00-00T00:00:00.000Z",
 *      "update_date":"2100-00-00T00:00:00.000Z",
 *      "type":"",
 *      "data":""
 * }
 */
router.put('/id/:id', auth(), awaitHandlerFactory(controller.update));
/**
 * DELETE /api/v1/drafts/id/{id}
 * @tags draft
 * @security CookieAuth
 * @param {string} id.path
 * @summary Deletes draft and returns id
 * @return {string} 200 - id
 * @example response - 200 - success response example
 * {
 *      "id":""
 * }
 */
router.delete('/id/:id', auth(), awaitHandlerFactory(controller.delete));

module.exports = router;