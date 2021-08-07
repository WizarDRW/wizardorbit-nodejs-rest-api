var Model = require("../models/library.model")
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const userRole = require('../utils/userRoles.utils')
const dotenv = require('dotenv');
var mongoose = require("mongoose");
dotenv.config();

/**
 * A login params dto
 * @tags library
 * @typedef {object} LibraryDto - Library Client
 * @property {string} name.required - Name
 * @property {string} description - Description
 * @property {string} image_path - Image Path
 * @property {boolean} private.required - Private or Public
 * @property {array<string>} contents - Contents
 */
class LibraryController {
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
            $lookup: {
                from: "chapters",
                localField: "contents",
                foreignField: "_id",
                as: "chapters"
            }
        },
        {
            $lookup: {
                from: "news",
                localField: "contents",
                foreignField: "_id",
                as: "news"
            }
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
                    localField: "contents",
                    foreignField: "_id",
                    as: "chapters"
                }
            },
            {
                $lookup: {
                    from: "news",
                    localField: "contents",
                    foreignField: "_id",
                    as: "news"
                }
            },], function (err, result) {
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
                    localField: "contents",
                    foreignField: "_id",
                    as: "chapters"
                }
            },
            {
                $lookup: {
                    from: "news",
                    localField: "contents",
                    foreignField: "_id",
                    as: "news"
                }
            },], function (err, result) {
                res.send(result);
            })
    };

    create = async (req, res, next) => {
        this.checkValidation(req);
        var obj = { ...req.body, create_date: new Date() }
        var result = await Model.create(obj);

        var response = await Model.aggregate([
            {
                $match: {
                    _id: result._id,
                },
            },
            {
                $lookup: {
                    from: "chapters",
                    localField: "contents",
                    foreignField: "_id",
                    as: "chapters"
                }
            },
            {
                $lookup: {
                    from: "news",
                    localField: "contents",
                    foreignField: "_id",
                    as: "news"
                }
            },
            {
                $limit: 1
            }])
        if (response.length > 0) res.status(201).send(response[0]); //Created
        else res.status(204).send("İçerik Yok"); //No Content
        
    };

    uploadImage = async (req, res, next) => {
        const file = req.files.photo;
        file.mv('./src/controllers/uploads/' + file.name, function (err, result) {
            if (err)
                throw err;
            res.send({
                success: true,
                message: "File uploaded!",
                result: result
            })
        })
    }

    update = async (req, res, next) => {
        if (req.currentUser._id == req.body.user_id || req.currentUser.role != userRole.Client) {
            Model.updateOne({ _id: req.params.id }, req.body).then((raw) => {
                if (raw.ok > 0)
                    res.status(200).send(req.body);
                else
                    res.status(304).send("Güncellenmedi!")
            })
        } else res.status(403).send("Yasaklandı!");
    };

    updateImpression = async (req, res, next) => {
        Model.findOne({ _id: req.body.blog_id },
            function (err, raw) {
                if (raw.impressions.filter(x => x.ip == req.body.ip_address).length == 0) {
                    raw.impressions.push({ ip: req.body.ip_address, count: 1 });
                    Model.updateOne({ _id: raw._id }, raw).then(x => {
                        if (x.ok > 0)
                            res.send("Updated!");
                        else
                            throw HttpException(x)

                    })
                } else {
                    raw.impressions.find(x => x.ip == req.body.ip_address).count += 1;
                    Model.updateOne({ _id: raw._id }, raw).then(x => {
                        if (x.ok > 0)
                            res.send("Updated!");
                        else
                            throw HttpException(x)

                    })
                }
            });
    };

    delete = async (req, res, next) => {
        var result = Model.deleteOne({ _id: req.params.id }, (err) => console.log(err))
        if (result) res.status(200).send(req.params.id);
        else res.status(500).send("Can't delete!");
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }
}
module.exports = new LibraryController;