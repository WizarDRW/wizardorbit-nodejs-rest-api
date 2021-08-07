const express = require('express');
const router = express.Router();
const controller = require('../controllers/news.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');


/**
 * GET /api/v1/news/
 * @tags news
 * @security CookieAuth
 * @summary Brings all news. Only Admin and Super User can summon.
 * @return {NewsDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"News Name",
 *          "impressions":[],
 *          "categories":[],
 *          "descriptions":[],
 *          "tags":[],
 *          "image_path":"http://ImagePath",
 *          "short_description":"Short Description",
 *          "create_date":"2100-00-00T00:00:00.000Z",
 *          "user_id":""
 *      }
 * ]
 */
router.get('/', auth(Role.Admin, Role.SuperUser), awaitHandlerFactory(controller.getAll));
/**
 * GET /api/v1/news/client
 * @tags news
 * @summary Returns all published news.
 * @return {NewsDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"News Name",
 *          "impressions":[],
 *          "categories":[],
 *          "descriptions":[],
 *          "tags":[],
 *          "image_path":"http://ImagePath",
 *          "short_description":"Short Description",
 *          "create_date":"2100-00-00T00:00:00.000Z",
 *          "user_id":""
 *      }
 * ]
 */
router.get('/client', awaitHandlerFactory(controller.getPublishedAll));
/**
 * GET /api/v1/news/find/{text}
 * @tags news
 * @summary The words searched in the news are called by both the title, the description and the short description.
 * @param {string} text.path Searched word.
 * @return {NewsDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"News Name",
 *          "impressions":[],
 *          "categories":[],
 *          "descriptions":[],
 *          "tags":[],
 *          "image_path":"http://ImagePath",
 *          "short_description":"Short Description",
 *          "create_date":"2100-00-00T00:00:00.000Z",
 *          "user_id":""
 *      }
 * ]
 */
router.get('/find/:text', awaitHandlerFactory(controller.getFindAll));
/**
 * GET /api/v1/news/top/{count}
 * @tags news
 * @summary Returns the first {count} most read.
 * @param {string} count.path Searched word.
 * @return {NewsDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"News Name",
 *          "impressions":[],
 *          "categories":[],
 *          "descriptions":[],
 *          "tags":[],
 *          "image_path":"http://ImagePath",
 *          "short_description":"Short Description",
 *          "create_date":"2100-00-00T00:00:00.000Z",
 *          "user_id":""
 *      }
 * ]
 */
router.get('/top/:count', awaitHandlerFactory(controller.getAllTop));
/**
 * GET /api/v1/news/id/{id}
 * @tags news
 * @summary Returns the first or default.
 * @param {string} id.path Searched word.
 * @return {NewsDto} 200 - Array
 * @example response - 200 - success response example
 * {
 *   "name":"News Name",
 *   "impressions":[],
 *   "categories":[],
 *   "descriptions":[],
 *   "tags":[],
 *   "image_path":"http://ImagePath",
 *   "short_description":"Short Description",
 *   "create_date":"2100-00-00T00:00:00.000Z",
 *   "user_id":""
 * }
 */
router.get('/id/:id', awaitHandlerFactory(controller.getById));
/**
 * GET /api/v1/news/userid/{user_id}
 * @tags news
 * @summary Returns the user's news.
 * @param {string} user_id.path Searched word.
 * @return {NewsDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"News Name",
 *          "impressions":[],
 *          "categories":[],
 *          "descriptions":[],
 *          "tags":[],
 *          "image_path":"http://ImagePath",
 *          "short_description":"Short Description",
 *          "create_date":"2100-00-00T00:00:00.000Z",
 *          "user_id":""
 *      }
 * ]
 */
router.get('/userid/:user_id', awaitHandlerFactory(controller.getByUserId));
/**
 * GET /api/v1/news/client/userid/{user_id}
 * @tags news
 * @summary Returns the client user's news.
 * @param {string} user_id.path Searched word.
 * @return {NewsDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"News Name",
 *          "impressions":[],
 *          "categories":[],
 *          "descriptions":[],
 *          "tags":[],
 *          "image_path":"http://ImagePath",
 *          "short_description":"Short Description",
 *          "create_date":"2100-00-00T00:00:00.000Z",
 *          "user_id":""
 *      }
 * ]
 */
router.get('/client/userid/:user_id', awaitHandlerFactory(controller.getByUserPublishedAll));
/**
 * POST /api/v1/news/
 * @tags news
 * @security CookieAuth
 * @summary Creates news and returns object.
 * @param {NewsDto} request.body.required 
 * @return {NewsDto} 200 - Array
 * @example response - 200 - success response example
 * {
 *   "name":"News Name",
 *   "impressions":[],
 *   "categories":[],
 *   "descriptions":[],
 *   "tags":[],
 *   "image_path":"http://ImagePath",
 *   "short_description":"Short Description",
 *   "create_date":"2100-00-00T00:00:00.000Z",
 *   "user_id":""
 * }
 */
router.post('/', auth(), awaitHandlerFactory(controller.create));
/**
 * PUT /api/v1/news/id/{id}
 * @tags news
 * @security CookieAuth
 * @summary Edits news and returns object
 * @param {string} id.path 
 * @return {NewsDto} 200 - Array
 * @example response - 200 - success response example
 * {
 *   "name":"News Name",
 *   "impressions":[],
 *   "categories":[],
 *   "descriptions":[],
 *   "tags":[],
 *   "image_path":"http://ImagePath",
 *   "short_description":"Short Description",
 *   "create_date":"2100-00-00T00:00:00.000Z",
 *   "user_id":""
 * }
 */
router.put('/id/:id', auth(), awaitHandlerFactory(controller.update)); // localhost:3000/api/v1/users/id/1 , using patch for partial update
router.put('/updateImpression/id/:id', awaitHandlerFactory(controller.updateImpression));
/**
 * DELETE /api/v1/news/id/{id}
 * @tags news
 * @security CookieAuth
 * @summary Deletes news and returns id
 * @param {string} id.path 
 * @return {string} 200 - id
 * @example response - 200 - success response example
 * {
 *   "id":""
 * }
 */
router.delete('/id/:id', auth(Role.Admin, Role.SuperUser), awaitHandlerFactory(controller.delete)); // localhost:3000/api/v1/users/id/1

module.exports = router;