const Model = require('../models/category.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

/**
 * A login params dto
 * @tags category
 * @typedef {object} CategoryDto - Category Client
 * @property {string} type.required - Name
 * @property {array<object>} categories - Image Path
 */
class CategoryController {
    getAll = async (req, res, next) => {
        Model.find(function (err, posts) {
            if (err) console.log(err);
            res.send(posts);
        });
    };

    getByType = async (req, res, next) => {
        const category = await Model.findOne({ type: req.params.type });
        if (!category) {
            throw new HttpException(404, 'Category not found');
        }

        res.send(category);
    };

    getById = async (req, res, next) => {
        const blogcategory = await Model.findOne({ id: req.params.id });
        if (!blogcategory) {
            throw new HttpException(404, 'Category not found');
        }

        res.send(blogcategory);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        const result = await Model.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Category was created!');
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        const result = await Model.updateOne({ _id: req.params.id }, req.body);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Category not found' :
            affectedRows && changedRows ? 'Category updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    delete = async (req, res, next) => {
        const result = await Model.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Category not found');
        }
        res.send('Category has been deleted');
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }
}
module.exports = new CategoryController;