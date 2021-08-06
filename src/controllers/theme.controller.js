const Model = require('../models/theme.model');
const HttpException = require('../utils/HttpException.utils');
const userRole = require("../utils/userRoles.utils")
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

class ThemeController {
    getAll = async (req, res, next) => {
        Model.find(function (err, posts) {
            if (err) console.log(err);
            res.send(posts);
        });
    };

    getById = async (req, res, next) => {
        const option = await Model.findOne({ _id: req.params.id });
        if (!option) {
            throw new HttpException(404, 'User option not found');
        }

        res.send(option);
    };

    getByName = async (req, res, next) => {
        const option = await Model.findOne({ name: req.params.name });
        if (!option) {
            throw new HttpException(404, 'User option not found');
        }

        res.send(option);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        const result = await Model.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('User option was created!');
    };

    update = async (req, res, next) => {
        if (req.currentUser._id == req.body.user_id || req.currentUser.role == userRole.SuperUser) {
            Model.updateOne({ _id: req.params.id }, req.body).then((raw) => {
                if (raw.ok > 0)
                    res.status(200).send(req.body);
                else
                    res.status(500).send("Güncellenmedi")
            })
        } else
            res.status(403).send("Forbidden!");
    };

    delete = async (req, res, next) => {
        const result = await Model.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'User option not found');
        }
        res.send('User option has been deleted');
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }
}
module.exports = new ThemeController;