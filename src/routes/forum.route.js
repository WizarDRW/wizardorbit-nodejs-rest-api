const express = require('express');
const router = express.Router();
const controller = require('../controllers/forum.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createValidateForum, updateValidateForum } = require('../middleware/validators/forumValidator.middleware');

/**
 * GET /api/v1/forums/
 * @tags forum
 * @security CookieAuth
 * @summary Brings all forums. Only Admin and Super User can summon.
 * @return {ForumDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"Forum Name",
 *          "impressions":[],
 *          "categories":[],
 *          "descriptions":[],
 *          "tags":[],
 *          "create_date":"2100-00-00T00:00:00.000Z",
 *          "user_data":{}
 *      }
 * ]
 */
router.get('/', auth(Role.Admin, Role.SuperUser), awaitHandlerFactory(controller.getAll));
/**
 * GET /api/v1/forums/client
 * @tags forum
 * @summary Returns all published forums.
 * @return {ForumDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"Forum Name",
 *          "impressions":[],
 *          "categories":[],
 *          "descriptions":[],
 *          "tags":[],
 *          "create_date":"2100-00-00T00:00:00.000Z",
 *          "user_data":{}
 *      }
 * ]
 */
router.get('/client', awaitHandlerFactory(controller.getPublishedAll));
/**
 * GET /api/v1/forums/find/{text}
 * @tags forum
 * @summary The words searched in the forums are called by both the title, the description and the short description.
 * @param {string} text.path Searched word.
 * @return {ForumDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"Forum Name",
 *          "impressions":[],
 *          "categories":[],
 *          "descriptions":[],
 *          "tags":[],
 *          "create_date":"2100-00-00T00:00:00.000Z",
 *          "user_data":{}
 *      }
 * ]
 */
router.get('/find/:text', awaitHandlerFactory(controller.getFindAll));
/**
 * GET /api/v1/forums/top/{count}
 * @tags forum
 * @summary Returns the first {count} most read.
 * @param {string} count.path Searched word.
 * @return {ForumDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"Forum Name",
 *          "impressions":[],
 *          "categories":[],
 *          "descriptions":[],
 *          "tags":[],
 *          "create_date":"2100-00-00T00:00:00.000Z",
 *          "user_data":{}
 *      }
 * ]
 */
router.get('/top/:count', awaitHandlerFactory(controller.getAllTop));
/**
 * GET /api/v1/forums/id/{id}
 * @tags forum
 * @summary Returns the first or default.
 * @param {string} id.path Searched word.
 * @return {ForumDto} 200 - Array
 * @example response - 200 - success response example
 * {
 *   "name":"Forum Name",
 *   "impressions":[],
 *   "categories":[],
 *   "descriptions":[],
 *   "tags":[],
 *   "create_date":"2100-00-00T00:00:00.000Z",
 *   "user_data":{}
 * }
 */
router.get('/id/:id', awaitHandlerFactory(controller.getById));
/**
 * GET /api/v1/forums/userid/{user_id}
 * @tags forum
 * @summary Returns the user's forums.
 * @param {string} user_id.path Searched word.
 * @return {ForumDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"Forum Name",
 *          "impressions":[],
 *          "categories":[],
 *          "descriptions":[],
 *          "tags":[],
 *          "create_date":"2100-00-00T00:00:00.000Z",
 *          "user_data":{}
 *      }
 * ]
 */
router.get('/userid/:user_id', auth(), awaitHandlerFactory(controller.getByUserId));
/**
 * GET /api/v1/forums/client/userid/{user_id}
 * @tags forum
 * @summary Returns the client user's forums.
 * @param {string} user_id.path Searched word.
 * @return {ForumDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"Forum Name",
 *          "impressions":[],
 *          "categories":[],
 *          "descriptions":[],
 *          "tags":[],
 *          "create_date":"2100-00-00T00:00:00.000Z",
 *          "user_data":{}
 *      }
 * ]
 */
router.get('/client/userid/:user_id', awaitHandlerFactory(controller.getByUserPublishedAll));
/**
 * POST /api/v1/forums/
 * @tags forum
 * @security CookieAuth
 * @summary Creates new forum and returns object.
 * @param {ForumDto} request.body.required
 * @return {ForumDto} 200 - Array
 * @example response - 200 - success response example
 * {
 *   "name":"Forum Name",
 *   "impressions":[],
 *   "categories":[],
 *   "descriptions":[],
 *   "tags":[],
 *   "create_date":"2100-00-00T00:00:00.000Z",
 *   "user_id":""
 * }
 */
router.post('/', auth(), createValidateForum, awaitHandlerFactory(controller.create));
/**
 * POST /api/v1/forums/comment/{id}
 * @tags forum
 * @security CookieAuth
 * @summary Creates new forum comment and returns object.
 * @param {ForumCommentDto} request.body.required
 * @return {ForumCommentDto} 200 - Array
 * @example response - 200 - success response example
 * {
 *   "user_id":"",
 *   "id":0,
 *   "comment_id":0,
 *   "description":"",
 *   "create_date":"2100-00-00T00:00:00.000Z"
 * }
 */
router.post('/comment/:id', auth(), awaitHandlerFactory(controller.createComment));
/**
 * PUT /api/v1/forums/id/{id}
 * @tags forum
 * @security CookieAuth
 * @summary Edits forum and returns object
 * @param {string} id.path 
 * @return {ForumDto} 200 - Array
 * @example response - 200 - success response example
 * {
 *   "name":"Forum Name",
 *   "impressions":[],
 *   "categories":[],
 *   "descriptions":[],
 *   "tags":[],
 *   "create_date":"2100-00-00T00:00:00.000Z",
 *   "user_id":""
 * }
 */
router.put('/id/:id', auth(), updateValidateForum, awaitHandlerFactory(controller.update));
router.put('/updateImpression/id/:id', awaitHandlerFactory(controller.updateImpression));
/**
 * DELETE /api/v1/forums/id/{id}
 * @tags forum
 * @security CookieAuth
 * @summary Deletes forum and returns id
 * @param {string} id.path 
 * @return {string} 200 - id
 * @example response - 200 - success response example
 * {
 *   "id":""
 * }
 */
router.delete('/id/:id', auth(Role.Admin, Role.SuperUser), awaitHandlerFactory(controller.delete));

module.exports = router;