const Model = require('../models/option.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

class OptionController {
    getAll = async (req, res, next) => {
        Model.find(function (err, posts) {
            if (err) console.log(err);
            res.send(posts);
        });
    };

    getById = async (req, res, next) => {
        Model.findById(req.params.id,
            function (err, post) {
                if (err) console.log(err);
                res.send(post);
            });
    };

    create = async (req, res, next) => {
        this.checkValidation(req);
        Model.create(req.body)

        res.status(201).send('Option was created!');
    };

    update = async (req, res, next) => {
        Model.update(req.params.id, req.body, (err, raw) => {
            console.log(raw);
        })

        res.send("Ok");
    };

    delete = async (req, res, next) => {
        Model.deleteOne(req.params._id, (err) => console.log(err))
        res.send('Option has been deleted');
    };
}
module.exports = new OptionController;