const Model = require('../models/menu.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

class MenuController {
    getAll = async (req, res, next) => {
        Model.find(function (err, posts) {
            if (err) console.log(err);
            res.send(posts);
        });
    };

    getById = async (req, res, next) => {
        const menu = await MenuModel.findOne({ id: req.params.id });
        if (!menu) {
            throw new HttpException(404, 'Menu not found');
        }

        res.send(menu);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        const result = await MenuModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Menu was created!');
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        // do the update query and get the result
        // it can be partial edit
        const result = await MenuModel.update(req.body, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Menu not found' :
            affectedRows && changedRows ? 'Menu updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    delete = async (req, res, next) => {
        const result = await MenuModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Menu not found');
        }
        res.send('Menu has been deleted');
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }
}
module.exports = new MenuController;