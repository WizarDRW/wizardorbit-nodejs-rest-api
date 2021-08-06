var Model = require("../models/log.model")
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
var mongoose = require("mongoose");
dotenv.config();

class LogController {
    getAll = async (req, res, next) => {
        await Model.aggregate([{
            $lookup:
            {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user_data"
            }
        },
        {
            $unwind: '$user_data'
        },
        {
            $project: {
                'user_data.password': 0,
                'user_data.role': 0,
                user_id: 0
            }
        }], function (err, posts) {
            if (err) console.log(err);
            res.send(posts);
        });
    };

    getById = async (req, res, next) => {
        const ObjectId = mongoose.Types.ObjectId;
        Model.aggregate([
            {
                $match: {
                    _id: ObjectId(req.params.id),
                },
            },
            {
                $lookup: {
                    from: "chapters",
                    localField: "type.id",
                    foreignField: "_id",
                    as: "chapter"
                }
            },
            {
                $lookup: {
                    from: "news",
                    localField: "type.id",
                    foreignField: "_id",
                    as: "news"
                }
            },
            {
                $lookup: {
                    from: "forums",
                    localField: "type.id",
                    foreignField: "_id",
                    as: "forum"
                }
            }], function (err, result) {
                res.send(result[0]);
            })
    };

    getByUserId = async (req, res, next) => {
        const ObjectId = mongoose.Types.ObjectId;
        Model.aggregate([
            {
                $match: {
                    user_id: ObjectId(req.params.user_id),
                },
            },
            {
                $lookup: {
                    from: "chapters",
                    localField: "type.id",
                    foreignField: "_id",
                    as: "chapter"
                }
            },
            {
                $lookup: {
                    from: "news",
                    localField: "type.id",
                    foreignField: "_id",
                    as: "news"
                }
            },
            {
                $lookup: {
                    from: "forums",
                    localField: "type.id",
                    foreignField: "_id",
                    as: "forum"
                }
            }], function (err, result) {
                res.send(result);
            })
    };

    create = async (req, res, next) => {
        this.checkValidation(req);
        var obj = { ...req.body, create_date: new Date() }
        Model.create(obj)

        res.status(201).send('Log was created!');
    };

    update = async (req, res, next) => {
        if (req.currentUser._id == req.body.user_data._id || req.currentUser.role != "Client") {
            Model.updateOne({ _id: req.params.id }, req.body).then((raw) => {
                if (raw.ok == 1)
                    res.send({ status: 200 });
                else
                    res.send({ status: 500 })
            })
        } else
            res.send({ status: 403 });
    };

    delete = async (req, res, next) => {
        Model.deleteOne({ _id: req.params.id }, (err) => console.log(err))
        res.send('Log has been deleted');
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }
}
module.exports = new LogController;