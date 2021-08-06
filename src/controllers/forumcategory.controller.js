const Model = require('../models/forumcategory.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

class ForumCategoryController {
    getAll = async (req, res, next) => {
        Model.find(function (err, posts) {
            if (err) console.log(err);
            res.send(posts);
        });
    };

    getNotNested = async (req, res, next) => {
        Model.find((err, posts) => {
            var arr = [];
            posts.forEach(element => {
                const { children, ...data } = element._doc;
                arr.push(...this.children(children))
            })
            res.send(arr);
        })
    }

    children(child) {
        var arr = [];
        child.forEach(element => {
            if (element.children) {
                arr.push(...this.children(element.children));
            } else {
                const { children, ...data } = element;
                arr.push({
                    ...data
                })
            }
        })
        return arr;
    }

    getById = async (req, res, next) => {
        const blogcategory = await Model.findOne({ id: req.params.id });
        if (!blogcategory) {
            throw new HttpException(404, 'Forum category not found');
        }

        res.send(blogcategory);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        const result = await Model.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Forum category was created!');
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        // do the update query and get the result
        // it can be partial edit
        const result = await Model.updateOne({ _id: req.params.id }, req.body);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Forum category not found' :
            affectedRows && changedRows ? 'Forum category updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    delete = async (req, res, next) => {
        const result = await Model.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Forum category not found');
        }
        res.send('Forum has been deleted');
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }
}
module.exports = new ForumCategoryController;