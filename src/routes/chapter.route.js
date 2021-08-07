const express = require('express');
const router = express.Router();
const controller = require('../controllers/chapter.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const {
    createValidateChapter,
    updateValidateChapter
} = require('../middleware/validators/chapterValidator.middleware');


/**
 * GET /api/v1/chapters/
 * @tags chapter
 * @security CookieAuth
 * @summary Brings all book chapters. Only Admin and Super User can summon.
 * @return {ChapterDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"Chapter Name",
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
 * GET /api/v1/chapters/client
 * @tags chapter
 * @summary Returns all published book chapters.
 * @return {ChapterDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"Chapter Name",
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
 * GET /api/v1/chapters/find/{text}
 * @tags chapter
 * @summary The words searched in the book chapters are called by both the title, the description and the short description.
 * @param {string} text.path Searched word.
 * @return {ChapterDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"Chapter Name",
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
 * GET /api/v1/chapters/top/{count}
 * @tags chapter
 * @summary Returns the first {count} most read.
 * @param {string} count.path Searched word.
 * @return {ChapterDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"Chapter Name",
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
 * GET /api/v1/chapters/id/{id}
 * @tags chapter
 * @summary Returns the first or default.
 * @param {string} id.path Searched word.
 * @return {ChapterDto} 200 - Array
 * @example response - 200 - success response example
 * {
 *   "name":"Chapter Name",
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
 * GET /api/v1/chapters/userid/{user_id}
 * @tags chapter
 * @summary Returns the user's book chapters.
 * @param {string} user_id.path Searched word.
 * @return {ChapterDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"Chapter Name",
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
 * GET /api/v1/chapters/client/userid/{user_id}
 * @tags chapter
 * @summary Returns the client user's book chapters.
 * @param {string} user_id.path Searched word.
 * @return {ChapterDto} 200 - Array
 * @example response - 200 - success response example
 * [
 *      {
 *          "name":"Chapter Name",
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
 * POST /api/v1/chapters/
 * @tags chapter
 * @security CookieAuth
 * @summary Creates new book chapter and returns object.
 * @param {ChapterDto} request.body.required 
 * @return {ChapterDto} 200 - Array
 * @example response - 200 - success response example
 * {
 *   "name":"Chapter Name",
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
router.post('/', auth(), createValidateChapter, awaitHandlerFactory(controller.create));
/**
 * PUT /api/v1/chapters/id/{id}
 * @tags chapter
 * @security CookieAuth
 * @summary Edits book chapter and returns object
 * @param {string} id.path 
 * @return {ChapterDto} 200 - Array
 * @example response - 200 - success response example
 * {
 *   "name":"Chapter Name",
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
router.put('/id/:id', auth(), updateValidateChapter, awaitHandlerFactory(controller.update));
router.put('/updateImpression/id/:id', awaitHandlerFactory(controller.updateImpression));
/**
 * DELETE /api/v1/chapters/id/{id}
 * @tags chapter
 * @security CookieAuth
 * @summary Deletes book chapter and returns id
 * @param {string} id.path 
 * @return {string} 200 - id
 * @example response - 200 - success response example
 * {
 *   "id":""
 * }
 */
router.delete('/id/:id', auth(Role.Admin, Role.SuperUser), awaitHandlerFactory(controller.delete));

module.exports = router;